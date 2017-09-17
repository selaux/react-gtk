const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkSpinButton = require('../../../src/components/GtkSpinButton');

describe('GtkSpinButton', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                SpinButton: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkSpinButton once', function () {
        const imports = getDefaultImports();
        const GtkSpinButton = injectGtkSpinButton(imports, logStub);

        const instance = {};
        imports.gi.Gtk.SpinButton.returns(instance);

        const gotInstance = new GtkSpinButton({});

        expect(imports.gi.Gtk.SpinButton.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
