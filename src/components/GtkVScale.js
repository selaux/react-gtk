module.exports = function (imports) {
    const GtkScale = require('./GtkScale')(imports);

    return class GtkVScale extends GtkScale {
        get InternalType() {
            return imports.gi.Gtk.VScale;
        }
    };
};