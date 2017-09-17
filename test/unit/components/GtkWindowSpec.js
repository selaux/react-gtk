const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkWindow = require('../../../src/components/GtkWindow');

describe('GtkWindow', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Window: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkWindow once', function () {
        const imports = getDefaultImports();
        const GtkWindow = injectGtkWindow(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Window.returns(instance);

        const gotInstance = new GtkWindow({});

        expect(imports.gi.Gtk.Window.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });

    it('should set the application for the window', function () {
        const imports = getDefaultImports();
        const GtkWindow = injectGtkWindow(imports, logStub);
        const application = 'my root app';

        const instance = {};
        imports.gi.Gtk.Window.returns(instance);

        new GtkWindow({}, application);

        expect(imports.gi.Gtk.Window.callCount).to.equal(1);
        expect(imports.gi.Gtk.Window.firstCall.args[0]).to.have.property('application', application);
    });
});
