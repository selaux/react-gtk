const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkBin = require('../../../src/components/GtkBin');

describe('GtkBin', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Bin: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkBin once', function () {
        const imports = getDefaultImports();
        const GtkBin = injectGtkBin(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Bin.returns(instance);

        const gotInstance = new GtkBin({});

        expect(imports.gi.Gtk.Bin.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
