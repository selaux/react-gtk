const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkHScale = require('../../../src/components/GtkHScale');

describe('GtkHScale', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Adjustment: sinon.stub(),
                HScale: sinon.stub()
            },
            GObject: {
                signal_lookup: sinon.stub().returns(0),
                signal_handler_block: sinon.stub(),
                signal_handler_unblock: sinon.stub(),
                signal_handler_is_connected: sinon.stub()
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
