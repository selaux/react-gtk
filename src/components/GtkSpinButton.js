module.exports = function (imports) {
    const GtkEntry = require('./GtkEntry')(imports);

    return class GtkSpinButton extends GtkEntry {
        get InternalType() {
            return imports.gi.Gtk.SpinButton;
        }
    };
};