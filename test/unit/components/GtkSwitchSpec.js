const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkSwitch = require('../../../src/components/GtkSwitch');

describe('GtkSwitch', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Switch: sinon.stub()
            },
            GObject: {
                signal_lookup: sinon.stub().returns(0),
                signal_handler_block: sinon.stub(),
                signal_handler_unblock: sinon.stub(),
                signal_handler_is_connected: sinon.stub(),
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkSwitch once', function () {
        const imports = getDefaultImports();
        const GtkSwitch = injectGtkSwitch(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Switch.returns(instance);

        const gotInstance = new GtkSwitch({});

        expect(imports.gi.Gtk.Switch.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });

    describe('uncontrolled', function () {
        it('should emit an onToggled signal with the new value', function () {
            const imports = getDefaultImports();
            const GtkSwitch = injectGtkSwitch(imports, logStub);

            const instance = { connect: sinon.stub(), get_active: sinon.stub().returns(true) };
            imports.gi.Gtk.Switch.returns(instance);
            imports.gi.GObject.signal_lookup.returns(1);

            const onToggled = sinon.stub();

            const gotInstance = new GtkSwitch({ onToggled });

            expect(gotInstance.instance.connect.callCount).to.equal(1);
            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(onToggled.callCount).to.equal(1);
            expect(onToggled.firstCall.args[0]).to.equal(instance);
            expect(onToggled.firstCall.args[1]).to.equal(true);
        });
    });

    describe('controlled', function () {
        it('should emit an onToggled signal with the new value', function () {
            const imports = getDefaultImports();
            const GtkSwitch = injectGtkSwitch(imports, logStub);

            const instance = { connect: sinon.stub(), get_active: sinon.stub().returns(true), set_active: sinon.stub() };
            imports.gi.Gtk.Switch.returns(instance);
            imports.gi.GObject.signal_lookup.returns(1);

            const onToggled = sinon.stub();

            const gotInstance = new GtkSwitch({ active: false, onToggled });

            expect(gotInstance.instance.connect.callCount).to.equal(1);
            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(onToggled.callCount).to.equal(1);
            expect(onToggled.firstCall.args[0]).to.equal(instance);
            expect(onToggled.firstCall.args[1]).to.equal(true);
        });

        it('should reset the value on the input', function () {
            const imports = getDefaultImports();
            const GtkSwitch = injectGtkSwitch(imports, logStub);

            const instance = { connect: sinon.stub(), get_active: sinon.stub().returns(true), set_active: sinon.stub() };
            imports.gi.Gtk.Switch.returns(instance);
            imports.gi.GObject.signal_lookup.returns(1);

            const onToggled = sinon.stub();

            const gotInstance = new GtkSwitch({ active: false, onToggled });

            expect(gotInstance.instance.connect.callCount).to.equal(1);
            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(gotInstance.instance.set_active.callCount).to.equal(1);
            expect(gotInstance.instance.set_active.firstCall.args[0]).to.equal(false);
        });

        it('should reset the value on the input after an update', function () {
            const imports = getDefaultImports();
            const GtkSwitch = injectGtkSwitch(imports, logStub);

            const instance = { connect: sinon.stub(), get_active: sinon.stub().returns(true), set_active: sinon.stub() };
            imports.gi.Gtk.Switch.returns(instance);
            imports.gi.GObject.signal_lookup.returns(1);

            const onToggledFirst = sinon.stub();
            const onToggledSecond = sinon.stub();

            const gotInstance = new GtkSwitch({ active: false, onToggled: onToggledFirst });
            gotInstance.update({ set: [[ "onToggled", onToggledSecond ]], unset: [] });

            expect(gotInstance.instance.connect.callCount).to.equal(2);
            gotInstance.instance.connect.secondCall.args[1](instance);

            expect(onToggledFirst.callCount).to.equal(0);
            expect(onToggledSecond.callCount).to.equal(1);
            expect(gotInstance.instance.set_active.callCount).to.equal(1);
            expect(gotInstance.instance.set_active.firstCall.args[0]).to.equal(false);
        });

        it('should disable the toggled event during an update', function () {
            const imports = getDefaultImports();
            const GtkSwitch = injectGtkSwitch(imports, logStub);

            const instance = { connect: sinon.stub().returns(123), get_active: sinon.stub().returns(true), set_active: sinon.stub() };
            imports.gi.Gtk.Switch.returns(instance);
            imports.gi.GObject.signal_lookup.returns(1);

            const gotInstance = new GtkSwitch({ active: false });
            gotInstance.update({ set: [[ "active", true ]], unset: [] });

            expect(imports.gi.GObject.signal_handler_block.callCount).to.equal(1);
            expect(imports.gi.GObject.signal_handler_block.firstCall.args[0]).to.equal(instance);
            expect(imports.gi.GObject.signal_handler_block.firstCall.args[1]).to.equal(123);
        });

        it('should unblock if the event has not changed', function () {
            const imports = getDefaultImports();
            const GtkSwitch = injectGtkSwitch(imports, logStub);

            const instance = { connect: sinon.stub().returns(123), get_active: sinon.stub().returns(true), set_active: sinon.stub() };
            imports.gi.Gtk.Switch.returns(instance);
            imports.gi.GObject.signal_lookup.returns(1);

            imports.gi.GObject.signal_handler_is_connected.withArgs(instance, 123).returns(true);

            const gotInstance = new GtkSwitch({ active: false });
            gotInstance.update({ set: [[ "active", true ]], unset: [] });

            expect(imports.gi.GObject.signal_handler_unblock.callCount).to.equal(1);
            expect(imports.gi.GObject.signal_handler_unblock.firstCall.args[0]).to.equal(instance);
            expect(imports.gi.GObject.signal_handler_unblock.firstCall.args[1]).to.equal(123);
        });
    });
});
