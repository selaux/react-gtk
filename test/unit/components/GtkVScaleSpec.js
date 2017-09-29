const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkVScale = require('../../../src/components/GtkVScale');

describe('GtkVScale', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Adjustment: sinon.stub(),
                VScale: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkVScale once', function () {
        const imports = getDefaultImports();
        const GtkVScale = injectGtkVScale(imports, logStub);

        const instance = {};
        imports.gi.Gtk.VScale.returns(instance);

        const gotInstance = new GtkVScale({});

        expect(imports.gi.Gtk.VScale.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
