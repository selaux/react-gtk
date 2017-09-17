module.exports = function (imports) {
    const GtkContainer = require('./GtkContainer')(imports);

    return class GtkBox extends GtkContainer {
        get InternalType() {
            return imports.gi.Gtk.Box;
        }
    };
};
