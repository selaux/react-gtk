module.exports = function (imports) {
    const GtkRange = require('./GtkRange')(imports);

    return class GtkScale extends GtkRange {
        get InternalType() {
            return imports.gi.Gtk.Scale;
        }
    };
};
