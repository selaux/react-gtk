const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkScale = require('../../../src/components/GtkScale');

describe('GtkScale', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Adjustment: sinon.stub(),
                Scale: sinon.stub()
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
});
