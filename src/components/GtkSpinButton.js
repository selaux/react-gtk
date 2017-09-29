module.exports = function (imports) {
    const GtkEntry = require('./GtkEntry')(imports);
    const withAdjustment = require('../lib/withAdjustment')(imports);

    return class GtkSpinButton extends GtkEntry {
        get InternalType() {
            return imports.gi.Gtk.SpinButton;
        }

        constructor(props) {
            const { adjustment, remaining } = withAdjustment.construct(props);
            super(remaining);
            this.instance.adjustment = adjustment;
        }

        update(changes) {
            const remaining = withAdjustment.update(this.instance.adjustment, changes);
            super.update(remaining);
        }
    };
};
