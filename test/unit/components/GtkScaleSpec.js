const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkScale = require('../../../src/components/GtkScale');

describe('GtkScale', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Adjustment: sinon.stub(),
                Scale: sinon.stub()
            },
            GObject: {
                signal_lookup: sinon.stub().returns(0),
                signal_handler_block: sinon.stub(),
                signal_handler_unblock: sinon.stub(),
                signal_handler_is_connected: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkScale once', function () {
        const imports = getDefaultImports();
        const GtkScale = injectGtkScale(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Scale.returns(instance);

        const gotInstance = new GtkScale({});

        expect(imports.gi.Gtk.Scale.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });

    describe('uncontrolled', function () {
        it('should emit an onValueChanged signal with the new value', function () {
            const imports = getDefaultImports();
            const GtkScale = injectGtkScale(imports, logStub);

            const instance = { connect: sinon.stub(), get_value: sinon.stub().returns(12) };
            imports.gi.Gtk.Scale.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('value-changed').returns(1);

            const onValueChanged = sinon.stub();

            const gotInstance = new GtkScale({ onValueChanged });

            expect(gotInstance.instance.connect.callCount).to.equal(1);
            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(onValueChanged.callCount).to.equal(1);
            expect(onValueChanged.firstCall.args[0]).to.equal(instance);
            expect(onValueChanged.firstCall.args[1]).to.equal(12);
        });
    });

    describe('controlled', function () {
        it('should emit an onValueChanged signal with the new value', function () {
            const imports = getDefaultImports();
            const GtkScale = injectGtkScale(imports, logStub);

            const instance = { connect: sinon.stub(), set_value: sinon.stub(), get_value: sinon.stub().returns(12) };
            imports.gi.Gtk.Scale.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('value-changed').returns(1);

            const onValueChanged = sinon.stub();

            const gotInstance = new GtkScale({ value: 1, onValueChanged });

            expect(gotInstance.instance.connect.callCount).to.equal(1);
            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(onValueChanged.callCount).to.equal(1);
            expect(onValueChanged.firstCall.args[0]).to.equal(instance);
            expect(onValueChanged.firstCall.args[1]).to.equal(12);
        });

        it('should reset the value to the old value after emitting', function () {
            const imports = getDefaultImports();
            const GtkScale = injectGtkScale(imports, logStub);

            const instance = { connect: sinon.stub(), set_value: sinon.stub(), get_value: sinon.stub().returns(12) };
            imports.gi.Gtk.Scale.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('value-changed').returns(1);

            const onValueChanged = sinon.stub();

            const gotInstance = new GtkScale({ value: 1, onValueChanged });

            expect(gotInstance.instance.connect.callCount).to.equal(1);
            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(instance.set_value.callCount).to.equal(1);
            expect(instance.set_value.firstCall.args[0]).to.equal(1);
        });

        it('should disable the toggled event during an update', function () {
            const imports = getDefaultImports();
            const GtkScale = injectGtkScale(imports, logStub);

            const instance = { connect: sinon.stub().returns(123), get_value: sinon.stub().returns(1), set_value: sinon.stub() };
            imports.gi.Gtk.Scale.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('value-changed').returns(1);

            const gotInstance = new GtkScale({ value: 1, onValueChanged: sinon.stub() });
            gotInstance.update({ set: [ [ 'value', 2 ] ], unset: [] });

            expect(imports.gi.GObject.signal_handler_block.callCount).to.equal(1);
            expect(imports.gi.GObject.signal_handler_block.firstCall.args[0]).to.equal(instance);
            expect(imports.gi.GObject.signal_handler_block.firstCall.args[1]).to.equal(123);
        });

        it('should unblock if the event has not changed', function () {
            const imports = getDefaultImports();
            const GtkScale = injectGtkScale(imports, logStub);

            const instance = { connect: sinon.stub().returns(123), get_value: sinon.stub().returns(1), set_value: sinon.stub() };
            imports.gi.Gtk.Scale.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('value-changed').returns(1);
            imports.gi.GObject.signal_handler_is_connected.withArgs(instance, 123).returns(true);

            const gotInstance = new GtkScale({ value: 1, onValueChanged: sinon.stub() });
            gotInstance.update({ set: [ [ 'value', 2 ] ], unset: [] });

            expect(imports.gi.GObject.signal_handler_unblock.callCount).to.equal(1);
            expect(imports.gi.GObject.signal_handler_unblock.firstCall.args[0]).to.equal(instance);
            expect(imports.gi.GObject.signal_handler_unblock.firstCall.args[1]).to.equal(123);
        });
    });
});
