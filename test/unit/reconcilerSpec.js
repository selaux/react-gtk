const sinon = require('sinon');
const { expect } = require('chai');

const createReconciler = require('../../src/reconciler');

describe('reconciler.js', function () {
    class ContainerStub {
        constructor() {
            this.add = sinon.stub();
            this.remove = sinon.stub();
        }
    }

    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Label: sinon.stub(),
                ApplicationWindow: sinon.stub(),
                Container: ContainerStub
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

    describe('adding first child', function () {
        it('should call show_all on the child', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const parent = {};
            const child = { show_all: sinon.stub() };

            Reconciler.appendInitialChild(parent, child);

            expect(child.show_all.callCount).to.equal(1);
        });

        it('should add the child to a Container parent', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const parent = new imports.gi.Gtk.Container();
            const child = { show_all: sinon.stub() };

            Reconciler.appendInitialChild(parent, child);

            expect(parent.add.callCount).to.equal(1);
            expect(parent.add.firstCall.args.length).to.equal(1);
            expect(parent.add.firstCall.args[0]).to.equal(child);
        });
    });

    describe('adding child', function () {
        it('should call show_all on the child', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const parent = {};
            const child = { show_all: sinon.stub() };

            Reconciler.appendChild(parent, child);

            expect(child.show_all.callCount).to.equal(1);
        });

        it('should add the child to a Container parent', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const parent = new imports.gi.Gtk.Container();
            const child = { show_all: sinon.stub() };

            Reconciler.appendChild(parent, child);

            expect(parent.add.callCount).to.equal(1);
            expect(parent.add.firstCall.args.length).to.equal(1);
            expect(parent.add.firstCall.args[0]).to.equal(child);
        });
    });

    describe('removing child', function () {
        it('should do nothing by default', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const parent = {};
            const child = {};

            Reconciler.removeChild(parent, child);
        });

        it('should remove the child from a Container parent', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);

            const parent = new imports.gi.Gtk.Container();
            const child = {};

            Reconciler.removeChild(parent, child);

            expect(parent.remove.callCount).to.equal(1);
            expect(parent.remove.firstCall.args.length).to.equal(1);
            expect(parent.remove.firstCall.args[0]).to.equal(child);
        });
    });

    describe('preparing update', function () {
        it('should return null if props are equal', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);
            const oldProps = { props: 1 };
            const newProps = { props: 1 };

            expect(Reconciler.prepareUpdate(null, null, oldProps, newProps)).to.equal(null);
        });

        it('should return null if only children differ', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);
            const oldProps = { props: 1, children: [ 2 ] };
            const newProps = { props: 1, children: [ 1 ] };

            expect(Reconciler.prepareUpdate(null, null, oldProps, newProps)).to.equal(null);
        });

        it('should return set when a prop differs from old prop', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);
            const oldProps = { prop: 1, children: [ 2 ] };
            const newProps = { prop: 2, children: [ 1 ] };

            expect(Reconciler.prepareUpdate(null, null, oldProps, newProps)).to.deep.equal({
                set: [
                    [ "prop", 2 ]
                ],
                unset: []
            });
        });

        it('should return unset a prop was removed', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);
            const oldProps = { prop1: 1, prop2: 1 };
            const newProps = { prop1: 1 };

            expect(Reconciler.prepareUpdate(null, null, oldProps, newProps)).to.deep.equal({
                set: [],
                unset: [ "prop2" ]
            });
        });
    });

    describe('committing update', function () {
        it('should set properties', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);
            const instance = { prop1: 1 };
            const changes = { set: [ [ "prop1", 2 ] ], unset: [] };

            Reconciler.commitUpdate(instance, changes);

            expect(instance.prop1).to.equal(2);
        });

        it('should unset properties', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports);
            const instance = { prop1: 1 };
            const changes = { set: [], unset: [ "prop1" ] };

            Reconciler.commitUpdate(instance, changes);

            expect(instance.prop1).to.equal(null);
        });
    });
});