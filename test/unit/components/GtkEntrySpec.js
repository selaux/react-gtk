const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkEntry = require('../../../src/components/GtkEntry');

describe('GtkEntry', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Entry: sinon.stub()
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
});
