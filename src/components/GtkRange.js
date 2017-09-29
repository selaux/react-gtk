module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);
    const withAdjustment = require('../lib/withAdjustment')(imports);

    return class GtkRange extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Range;
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
