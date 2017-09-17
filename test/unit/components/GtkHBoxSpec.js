const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkHBox = require('../../../src/components/GtkHBox');

describe('GtkHBox', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                HBox: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkHBox once', function () {
        const imports = getDefaultImports();
        const GtkHBox = injectGtkHBox(imports, logStub);

        const instance = {};
        imports.gi.Gtk.HBox.returns(instance);

        const gotInstance = new GtkHBox({});

        expect(imports.gi.Gtk.HBox.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
