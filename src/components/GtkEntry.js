module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);

    return class GtkEntry extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Entry;
        }
    };
};
