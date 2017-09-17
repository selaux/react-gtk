module.exports = function (imports) {
    const GtkButton = require('./GtkButton')(imports);

    return class GtkToggleButton extends GtkButton {
        get InternalType() {
            return imports.gi.Gtk.ToggleButton;
        }
    };
};
