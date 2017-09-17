const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkMisc = require('../../../src/components/GtkMisc');

describe('GtkMisc', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Misc: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkMisc once', function () {
        const imports = getDefaultImports();
        const GtkMisc = injectGtkMisc(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Misc.returns(instance);

        const gotInstance = new GtkMisc({});

        expect(imports.gi.Gtk.Misc.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
