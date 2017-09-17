const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkSwitch = require('../../../src/components/GtkSwitch');

describe('GtkSwitch', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Switch: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkSwitch once', function () {
        const imports = getDefaultImports();
        const GtkSwitch = injectGtkSwitch(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Switch.returns(instance);

        const gotInstance = new GtkSwitch({});

        expect(imports.gi.Gtk.Switch.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });
});
