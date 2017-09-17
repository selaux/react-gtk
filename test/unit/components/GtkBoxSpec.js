const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkBox = require('../../../src/components/GtkBox');

describe('GtkBox', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Box: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkBox once', function () {
        const imports = getDefaultImports();
        const GtkBox = injectGtkBox(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Box.returns(instance);

        const gotInstance = new GtkBox({});

        expect(imports.gi.Gtk.Box.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
