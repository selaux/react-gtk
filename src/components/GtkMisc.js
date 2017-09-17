module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);

    return class GtkMisc extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Misc;
        }
    };
};
