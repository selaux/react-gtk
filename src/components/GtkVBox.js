module.exports = function (imports) {
    const GtkBox = require('./GtkBox')(imports);

    return class GtkVBox extends GtkBox {
        get InternalType() {
            return imports.gi.Gtk.VBox;
        }
    };
};
