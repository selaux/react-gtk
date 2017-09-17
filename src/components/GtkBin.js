module.exports = function (imports) {
    const GtkContainer = require('./GtkContainer')(imports);

    return class GtkBin extends GtkContainer {
        get InternalType() {
            return imports.gi.Gtk.Bin;
        }
    };
};
