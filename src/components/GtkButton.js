module.exports = function (imports) {
    const GtkBin = require('./GtkBin')(imports);

    return class GtkButton extends GtkBin {
        get InternalType() {
            return imports.gi.Gtk.Button;
        }
    };
};
