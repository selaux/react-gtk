module.exports = function (imports) {
    const GtkMisc = require('./GtkMisc')(imports);

    return class GtkLabel extends GtkMisc {
        get InternalType() {
            return imports.gi.Gtk.Label;
        }
    };
};
