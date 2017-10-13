const R = require('ramda');
const updateProperties = require('./updateProperties');

const PASS_TO_ADJUSTMENT = [ 'lower', 'upper', 'stepIncrement', 'pageIncrement', 'pageSize', 'value' ];

module.exports = function withAdjustment(imports) {
    const GtkAdjustment = imports.gi.Gtk.Adjustment;

    return {
        construct(props) {
            const adjustment = new GtkAdjustment(R.pick(PASS_TO_ADJUSTMENT, props));
            const remaining = R.omit(PASS_TO_ADJUSTMENT, props);

            return { adjustment, remaining };
        },

        update(adjustment, { set, unset }) {
            const adjustmentPropsToSet = R.filter(R.pipe(R.head, R.contains(R.__, PASS_TO_ADJUSTMENT)), set);
            const adjustmentPropsToUnset = R.filter(R.contains(R.__, PASS_TO_ADJUSTMENT), unset);
            const restSet = R.without(adjustmentPropsToSet, set);
            const restUnset = R.without(adjustmentPropsToUnset, unset);

            updateProperties(adjustment, adjustmentPropsToSet, adjustmentPropsToUnset);

            return { set: restSet, unset: restUnset };
        }
    };
};
