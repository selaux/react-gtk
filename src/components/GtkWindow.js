const R = require('ramda');

module.exports = function (imports) {
    const GtkContainer = require('./GtkContainer')(imports);

    return class GtkWindow extends GtkContainer {
        get InternalType() {
            return imports.gi.Gtk.Window;
        }

        constructor(props, rootContainerInstance, ...args) {
            const propsWithApplication = R.assoc('application', rootContainerInstance, props);
            super(propsWithApplication, rootContainerInstance, ...args);
        }
    };
};
