const sinon = require('sinon');
const { expect } = require('chai');

const createReconciler = require('../../src/reconciler');

describe('reconciler.js', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Label: sinon.stub(),
                ApplicationWindow: sinon.stub()
            },
            GObject: {
                signal_lookup: sinon.stub()
            }
        }

    });

    describe('instancing', function () {
        it('should instance a type once', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const instance = {};
            imports.gi.Gtk.Label.returns(instance);

            const gotInstance = Reconciler.createInstance('Gtk.Label', {});

            expect(imports.gi.Gtk.Label.callCount).to.equal(1);
            expect(gotInstance).to.equal(instance);
        });

        it('should instance with properties', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const instance = {};
            imports.gi.Gtk.Label.returns(instance);

            Reconciler.createInstance('Gtk.Label', { some: 'prop' });

            expect(imports.gi.Gtk.Label.firstCall.args).to.deep.equal([ { some: 'prop' } ]);
        });

        it('should not set the children property', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const instance = {};
            imports.gi.Gtk.Label.returns(instance);

            Reconciler.createInstance('Gtk.Label', { some: 'prop', children: [] });

            expect(imports.gi.Gtk.Label.firstCall.args).to.deep.equal([ { some: 'prop' } ]);
        });

        it('should set signal handlers', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const instance = { connect: sinon.stub() };
            imports.gi.Gtk.Label.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('clicked', imports.gi.Gtk.Label).returns(124);

            const handler = () => ({});
            Reconciler.createInstance('Gtk.Label', { onClicked: handler, children: [] });

            expect(instance.connect.firstCall.args).to.deep.equal([ 'clicked', handler ]);
        });

        it('should not set unknown signal handlers', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const instance = { connect: sinon.stub() };
            imports.gi.Gtk.Label.returns(instance);
            imports.gi.GObject.signal_lookup.returns(0);

            Reconciler.createInstance('Gtk.Label', { onSomething: () => {}, children: [] });

            expect(instance.connect.callCount).to.equal(0);
        });

        it('should set an application window if neccessary', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const application = {};
            const instance = { my: 'app' };
            imports.gi.Gtk.ApplicationWindow.returns(instance);
            imports.gi.GObject.signal_lookup.returns(0);

            Reconciler.createInstance('Gtk.ApplicationWindow', {}, application);

            expect(imports.gi.Gtk.ApplicationWindow.firstCall.args).to.deep.equal([ { application } ]);
        });
    });
});