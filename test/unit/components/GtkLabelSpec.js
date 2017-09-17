const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkLabel = require('../../../src/components/GtkLabel');

describe('GtkLabel', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Label: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkLabel once', function () {
        const imports = getDefaultImports();
        const GtkLabel = injectGtkLabel(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Label.returns(instance);

        const gotInstance = new GtkLabel({});

        expect(imports.gi.Gtk.Label.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
