module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);

    return class GtkContainer extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Container;
        }

        appendChild(child) {
            this.instance.add(child.instance);
        }

        removeChild(child) {
            this.instance.remove(child.instance);
        }
    };
};
