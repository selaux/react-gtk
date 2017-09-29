const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkSpinButton = require('../../../src/components/GtkSpinButton');

describe('GtkSpinButton', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Adjustment: sinon.stub(),
                SpinButton: sinon.stub()
            },
            GObject: {
                signal_lookup: sinon.stub().returns(0)
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkSpinButton once', function () {
        const imports = getDefaultImports();
        const GtkSpinButton = injectGtkSpinButton(imports, logStub);

        const instance = {};
        imports.gi.Gtk.SpinButton.returns(instance);

        const gotInstance = new GtkSpinButton({});

        expect(imports.gi.Gtk.SpinButton.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });

    it('should instance a GtkAdjustment', function () {
        const imports = getDefaultImports();
        const GtkSpinButton = injectGtkSpinButton(imports, logStub);

        const instance = {};
        const adjustmentInstance = {};
        imports.gi.Gtk.SpinButton.returns(instance);
        imports.gi.Gtk.Adjustment.returns(adjustmentInstance);

        const gotInstance = new GtkSpinButton({});

        expect(imports.gi.Gtk.Adjustment.callCount).to.equal(1);
        expect(gotInstance.instance.adjustment).to.equal(adjustmentInstance);
    });

    it('should pass correct props to GtkAdjustment when initializing', function () {
        const imports = getDefaultImports();
        const GtkSpinButton = injectGtkSpinButton(imports, logStub);

        const instance = {};
        const adjustmentInstance = {};
        imports.gi.Gtk.SpinButton.returns(instance);
        imports.gi.Gtk.Adjustment.returns(adjustmentInstance);

        new GtkSpinButton({
            value: -1,
            lower: 0,
            upper: 1,
            stepIncrement: 2,
            pageIncrement: 3,
            pageSize: 4,
            other: 5
        });

        expect(imports.gi.Gtk.Adjustment.firstCall.args[0]).to.deep.equal({
            value: -1,
            lower: 0,
            upper: 1,
            stepIncrement: 2,
            pageIncrement: 3,
            pageSize: 4
        });
        expect(imports.gi.Gtk.SpinButton.firstCall.args[0]).to.deep.equal({
            other: 5
        });
    });

    it('should pass correct props to GtkAdjustment when updating', function () {
        const imports = getDefaultImports();
        const GtkSpinButton = injectGtkSpinButton(imports, logStub);

        const instance = {};
        const adjustmentInstance = { value: 2 };
        imports.gi.Gtk.SpinButton.returns(instance);
        imports.gi.Gtk.Adjustment.returns(adjustmentInstance);

        const rangeInstance = new GtkSpinButton({ value: 2, some: 'prop' });

        rangeInstance.update({ set: [ [ 'value', 1 ] ], unset: [ 'some' ] });
        expect(rangeInstance.instance.some).to.equal(null);
        expect(rangeInstance.instance.adjustment.value).to.equal(1);
    });
});
