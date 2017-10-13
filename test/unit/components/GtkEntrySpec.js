const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkEntry = require('../../../src/components/GtkEntry');

describe('GtkEntry', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Entry: sinon.stub()
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

    it('should instance GtkEntry once', function () {
        const imports = getDefaultImports();
        const GtkEntry = injectGtkEntry(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Entry.returns(instance);

        const gotInstance = new GtkEntry({});

        expect(imports.gi.Gtk.Entry.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });

    it('should not set a text value to undefined', function () {
        const imports = getDefaultImports();
        const GtkEntry = injectGtkEntry(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Entry.returns(instance);

        const gotInstance = new GtkEntry({});

        expect(imports.gi.Gtk.Entry.callCount).to.equal(1);
        expect(imports.gi.Gtk.Entry.firstCall.args[0]).to.deep.equal({});
        expect(gotInstance.instance).to.not.have.property('text');
    });

    it('should not set a onChanged handler to undefined', function () {});

    describe('uncontrolled', function () {
        it('should emit an onChanged signal with the new value', function () {
            const imports = getDefaultImports();
            const GtkEntry = injectGtkEntry(imports, logStub);

            const instance = { connect: sinon.stub(), get_text: sinon.stub().returns('new text') };
            imports.gi.Gtk.Entry.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('changed').returns(1);

            const onChanged = sinon.stub();

            const gotInstance = new GtkEntry({ onChanged });

            expect(gotInstance.instance.connect.callCount).to.equal(1);
            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(onChanged.callCount).to.equal(1);
            expect(onChanged.firstCall.args[0]).to.equal(instance);
            expect(onChanged.firstCall.args[1]).to.equal('new text');
        });
    });

    describe('controlled', function () {
        it('should emit an onChanged signal with the new value', function () {
            const imports = getDefaultImports();
            const GtkEntry = injectGtkEntry(imports, logStub);

            const instance = { connect: sinon.stub(), get_text: sinon.stub().returns('new text') };
            imports.gi.Gtk.Entry.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('changed').returns(1);

            const onChanged = sinon.stub();

            const gotInstance = new GtkEntry({ onChanged });

            expect(gotInstance.instance.connect.callCount).to.equal(1);
            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(onChanged.callCount).to.equal(1);
            expect(onChanged.firstCall.args[0]).to.equal(instance);
            expect(onChanged.firstCall.args[1]).to.equal('new text');
        });

        it('should reset the value to the old value after emitting', function () {
            const imports = getDefaultImports();
            const GtkEntry = injectGtkEntry(imports, logStub);

            const instance = { connect: sinon.stub(), set_text: sinon.stub(), get_text: sinon.stub().returns('text') };
            imports.gi.Gtk.Entry.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('changed').returns(1);

            const onChanged = sinon.stub();

            const gotInstance = new GtkEntry({ text: 'aloha', onChanged });

            gotInstance.instance.connect.firstCall.args[1](instance);

            expect(instance.set_text.callCount).to.equal(1);
            expect(instance.set_text.firstCall.args[0]).to.equal('aloha');
        });

        it('should disable the toggled event during an update', function () {
            const imports = getDefaultImports();
            const GtkEntry = injectGtkEntry(imports, logStub);

            const instance = {
                connect: sinon.stub().withArgs('changed').returns(123),
                set_text: sinon.stub(),
                get_text: sinon.stub().returns('text')
            };
            imports.gi.Gtk.Entry.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('changed').returns(1);

            const gotInstance = new GtkEntry({ text: 'first text', onChanged: sinon.stub() });
            gotInstance.update({ set: [ [ 'text', 'second text' ] ], unset: [] });

            expect(imports.gi.GObject.signal_handler_block.callCount).to.equal(1);
            expect(imports.gi.GObject.signal_handler_block.firstCall.args[0]).to.equal(instance);
            expect(imports.gi.GObject.signal_handler_block.firstCall.args[1]).to.equal(123);
        });

        it('should unblock if the event has not changed', function () {
            const imports = getDefaultImports();
            const GtkEntry = injectGtkEntry(imports, logStub);

            const instance = {
                connect: sinon.stub().withArgs('changed').returns(123),
                set_text: sinon.stub(),
                get_text: sinon.stub().returns('text')
            };
            imports.gi.Gtk.Entry.returns(instance);
            imports.gi.GObject.signal_lookup.withArgs('changed').returns(1);
            imports.gi.GObject.signal_handler_is_connected.withArgs(instance, 123).returns(true);

            const gotInstance = new GtkEntry({ text: 'test1', onChanged: sinon.stub() });
            gotInstance.update({ set: [ [ 'text', 'test2' ] ], unset: [] });

            expect(imports.gi.GObject.signal_handler_unblock.callCount).to.equal(1);
            expect(imports.gi.GObject.signal_handler_unblock.firstCall.args[0]).to.equal(instance);
            expect(imports.gi.GObject.signal_handler_unblock.firstCall.args[1]).to.equal(123);
        });
    });
});
