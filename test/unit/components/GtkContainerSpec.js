const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkContainer = require('../../../src/components/GtkContainer');

describe('GtkContainer', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Container: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkContainer once', function () {
        const imports = getDefaultImports();
        const GtkContainer = injectGtkContainer(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Container.returns(instance);

        const gotInstance = new GtkContainer({});

        expect(imports.gi.Gtk.Container.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });

    it('should append children', function () {
        const imports = getDefaultImports();
        const GtkContainer = injectGtkContainer(imports, logStub);

        const instance = { add: sinon.spy() };
        imports.gi.Gtk.Container.returns(instance);

        const gotInstance = new GtkContainer({});
        gotInstance.appendChild({ instance: 'mychild' });

        expect(instance.add.callCount).to.equal(1);
        expect(instance.add.firstCall.args).to.deep.equal([ 'mychild' ]);
    });

    it('should remove children', function () {
        const imports = getDefaultImports();
        const GtkContainer = injectGtkContainer(imports, logStub);

        const instance = { remove: sinon.spy() };
        imports.gi.Gtk.Container.returns(instance);

        const gotInstance = new GtkContainer();
        gotInstance.removeChild({ instance: 'myinstance' });

        expect(instance.remove.callCount).to.equal(1);
        expect(instance.remove.firstCall.args).to.deep.equal([ 'myinstance' ]);
    });
});
