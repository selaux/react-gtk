const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkRange = require('../../../src/components/GtkRange');

describe('GtkRange', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Range: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkRange once', function () {
        const imports = getDefaultImports();
        const GtkRange = injectGtkRange(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Range.returns(instance);

        const gotInstance = new GtkRange({});

        expect(imports.gi.Gtk.Range.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
