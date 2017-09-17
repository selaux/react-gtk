const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkToggleButton = require('../../../src/components/GtkToggleButton');

describe('GtkToggleButton', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                ToggleButton: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkToggleButton once', function () {
        const imports = getDefaultImports();
        const GtkToggleButton = injectGtkToggleButton(imports, logStub);

        const instance = {};
        imports.gi.Gtk.ToggleButton.returns(instance);

        const gotInstance = new GtkToggleButton({});

        expect(imports.gi.Gtk.ToggleButton.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
