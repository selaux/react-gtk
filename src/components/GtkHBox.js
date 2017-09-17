module.exports = function (imports) {
    const GtkBox = require('./GtkBox')(imports);

    return class GtkHBox extends GtkBox {
        get InternalType() {
            return imports.gi.Gtk.HBox;
        }
    };
};
