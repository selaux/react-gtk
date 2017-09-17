const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkVBox = require('../../../src/components/GtkVBox');

describe('GtkVBox', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                VBox: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkVBox once', function () {
        const imports = getDefaultImports();
        const GtkVBox = injectGtkVBox(imports, logStub);

        const instance = {};
        imports.gi.Gtk.VBox.returns(instance);

        const gotInstance = new GtkVBox({});

        expect(imports.gi.Gtk.VBox.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
