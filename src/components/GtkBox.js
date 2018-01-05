module.exports = function (imports) {
    const GtkContainer = require('./GtkContainer')(imports);

    return class GtkBox extends GtkContainer {
        get InternalType() {
            return imports.gi.Gtk.Box;
        }

        appendChild(child) {
            const children = this.instance.get_children();

            if (children.includes(child.instance)) {
                this.instance.reorder_child(child.instance, -1);
            } else {
                this.instance.add(child.instance);
            }
        }

        insertBefore(child, beforeChild) {
            const children = this.instance.get_children();

            if (!children.includes(child.instance)) {
                this.instance.add(child.instance);
            }

            const beforeChildIndex = children.indexOf(beforeChild.instance);
            this.instance.reorder_child(child.instance, beforeChildIndex);
        }
    };
};
