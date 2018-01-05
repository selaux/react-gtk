module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);

    return class GtkContainer extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Container;
        }

        appendChild(child) {
            const children = this.instance.get_children();

            if (!children.includes(child.instance)) {
                this.instance.add(child.instance);
            }
        }

        insertBefore(child) {
            const children = this.instance.get_children();

            if (!children.includes(child.instance)) {
                this.instance.add(child.instance);
            }
        }

        removeChild(child) {
            this.instance.remove(child.instance);
        }
    };
};
