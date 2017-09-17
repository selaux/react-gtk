module.exports = function (imports) {
    const GtkScale = require('./GtkScale')(imports);

    return class GtkHScale extends GtkScale {
        get InternalType() {
            return imports.gi.Gtk.HScale;
        }
    };
};