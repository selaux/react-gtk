module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);

    return class GtkRange extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Range;
        }
    };
};
