const R = require('ramda');

function wrapOnChanged(instance, onChanged) {
    return function wrappedonChanged(entry) {
        if (onChanged) {
            onChanged(entry, entry.get_text());
        }

        if (instance.isControlled()) {
            entry.set_text(instance.appliedText);
        }
    };
}

module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);
    const GObject = imports.gi.GObject;

    return class GtkEntry extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Entry;
        }

        constructor(props, ...args) {
            const appliedProps = R.omit([ 'onChanged', 'text' ], props);
            const set = [
                [ "onChanged", props.onChanged ],
                [ "text", props.text ]
            ].filter(([ prop, value ]) => typeof value !== 'undefined');

            super(appliedProps, ...args);

            this.update({ set, unset: [] });
        }

        isControlled() {
            return typeof this.appliedText !== 'undefined';
        }

        update(changes) {
            const { set, unset } = changes;
            const value = set.find(([ prop ]) => prop === 'text');
            const appliedSet = set.map(([ prop, value ]) => {
                if (prop === 'onChanged') {
                    return [ prop, wrapOnChanged(this, value) ];
                }
                return [ prop, value ];
            });
            const connectedToggleHandlerId = this.instance._connectedSignals['changed'];

            if (connectedToggleHandlerId) {
                GObject.signal_handler_block(this.instance, connectedToggleHandlerId);
            }

            super.update({ set: appliedSet, unset });

            if (value) {
                this.appliedText = value[1];
            }
            if (GObject.signal_handler_is_connected(this.instance, connectedToggleHandlerId)) {
                GObject.signal_handler_unblock(this.instance, connectedToggleHandlerId);
            }

        }
    };
};
