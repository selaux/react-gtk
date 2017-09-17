module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);

    return class GtkSwitch extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Switch;
        }
    };
};
