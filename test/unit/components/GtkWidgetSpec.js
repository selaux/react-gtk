const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkWidget = require('../../../src/components/GtkWidget');

describe('GtkWidget', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Widget: sinon.stub()
            },
            GObject: {
                signal_lookup: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    describe('constructor', function () {
        it('should instance GtkWidget once', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);

            const instance = {};
            imports.gi.Gtk.Widget.returns(instance);

            const gotInstance = new GtkWidget({});

            expect(imports.gi.Gtk.Widget.callCount).to.equal(1);
            expect(gotInstance.instance).to.equal(instance);
        });

        it('should instance with properties', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);

            const instance = {};
            imports.gi.Gtk.Widget.returns(instance);

            new GtkWidget({ some: 'prop' });

            expect(imports.gi.Gtk.Widget.firstCall.args).to.deep.equal([ { some: 'prop' } ]);
        });

        it('should not set the children property', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);

            const instance = {};
            imports.gi.Gtk.Widget.returns(instance);

            new GtkWidget({ some: 'prop', children: [] });

            expect(imports.gi.Gtk.Widget.firstCall.args).to.deep.equal([ { some: 'prop' } ]);
        });

        it('should set signal handlers', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);

            const handleId = 111;
            const instance = { connect: sinon.stub().returns(handleId) };
            imports.gi.Gtk.Widget.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('clicked', imports.gi.Gtk.Widget).returns(124);

            const handler = () => ({});
            new GtkWidget({ onClicked: handler, children: [] });

            expect(instance.connect.firstCall.args).to.deep.equal([ 'clicked', handler ]);
            expect(instance._connectedSignals).to.deep.equal({ clicked: handleId });
        });

        it('should not set unknown signal handlers', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);

            const instance = { connect: sinon.stub() };
            imports.gi.Gtk.Widget.returns(instance);
            imports.gi.GObject.signal_lookup.returns(0);

            new GtkWidget({ onSomething: () => {}, children: [] });

            expect(instance.connect.callCount).to.equal(0);
        });
    });

    describe('adding child', function () {
        it('should throw', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);

            const widget = new GtkWidget();

            expect(() => widget.appendChild({})).to.throw();
        });
    });

    describe('removing child', function () {
        it('should throw', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);

            const widget = new GtkWidget();

            expect(() => widget.removeChild({})).to.throw();
        });
    });

    describe('committing update', function () {
        it('should set properties', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);
            const instance = { prop1: 1 };
            const changes = { set: [ [ 'prop1', 2 ] ], unset: [] };

            imports.gi.GObject.signal_lookup.returns(0);
            imports.gi.Gtk.Widget.returns(instance);

            const widget = new GtkWidget();
            widget.update(changes);

            expect(instance.prop1).to.equal(2);
        });

        it('should unset properties', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);
            const instance = { prop1: 1 };
            const changes = { set: [], unset: [ 'prop1' ] };

            imports.gi.GObject.signal_lookup.returns(0);
            imports.gi.Gtk.Widget.returns(instance);

            const widget = new GtkWidget();
            widget.update(changes);

            expect(instance.prop1).to.equal(null);
        });

        it('should set signal handlers', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);
            const instance = { connect: sinon.stub().returns(124) };
            const onClicked = () => 'on clicked';
            const changes = { set: [ [ 'onClicked', onClicked ] ], unset: [] };

            imports.gi.GObject.signal_lookup.withArgs('clicked', instance).returns(1);
            imports.gi.Gtk.Widget.returns(instance);

            const widget = new GtkWidget();
            widget.update(changes);

            expect(instance.connect.callCount).to.equal(1);
            expect(instance.connect.firstCall.args).to.deep.equal([ 'clicked', onClicked ]);
            expect(instance._connectedSignals).to.deep.equal({ clicked: 124 });
        });

        it('should update signal handlers', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);
            const instance = {
                connect: sinon.stub().returns(124),
                disconnect: sinon.spy(),
                _connectedSignals: { clicked: 125 }
            };
            const onClicked = () => 'on clicked';
            const changes = { set: [ [ 'onClicked', onClicked ] ], unset: [] };

            imports.gi.GObject.signal_lookup.withArgs('clicked', instance).returns(124);
            imports.gi.Gtk.Widget.returns(instance);

            const widget = new GtkWidget();
            widget.update(changes);

            expect(instance.connect.callCount).to.equal(1);
            expect(instance.connect.firstCall.args).to.deep.equal([ 'clicked', onClicked ]);
            expect(instance.disconnect.callCount).to.equal(1);
            expect(instance.disconnect.firstCall.args).to.deep.equal([ 125 ]);
            expect(instance._connectedSignals).to.deep.equal({ clicked: 124 });
        });

        it('should remove signal handlers', function () {
            const imports = getDefaultImports();
            const GtkWidget = injectGtkWidget(imports, logStub);
            const instance = {
                disconnect: sinon.spy(),
                _connectedSignals: { clicked: 125 }
            };
            const changes = { set: [], unset: [ 'onClicked' ] };

            imports.gi.GObject.signal_lookup.withArgs('clicked', instance).returns(124);
            imports.gi.Gtk.Widget.returns(instance);

            const widget = new GtkWidget();
            widget.update(changes);

            expect(instance.disconnect.callCount).to.equal(1);
            expect(instance.disconnect.firstCall.args).to.deep.equal([ 125 ]);
            expect(instance._connectedSignals).to.deep.equal({});
        });
    });
});
