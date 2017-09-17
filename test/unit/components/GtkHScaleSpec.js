const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkHScale = require('../../../src/components/GtkHScale');

describe('GtkHScale', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                HScale: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkHScale once', function () {
        const imports = getDefaultImports();
        const GtkHScale = injectGtkHScale(imports, logStub);

        const instance = {};
        imports.gi.Gtk.HScale.returns(instance);

        const gotInstance = new GtkHScale({});

        expect(imports.gi.Gtk.HScale.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});