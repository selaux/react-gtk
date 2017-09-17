const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkButton = require('../../../src/components/GtkButton');

describe('GtkButton', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Button: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkButton once', function () {
        const imports = getDefaultImports();
        const GtkButton = injectGtkButton(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Button.returns(instance);

        const gotInstance = new GtkButton({});

        expect(imports.gi.Gtk.Button.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
