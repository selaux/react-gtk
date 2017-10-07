const R = require('ramda');

function wrapOnValueChanged(instance, onValueChanged) {
    return function wrappedOnValueChanged(scale) {
        if (onValueChanged) {
            onValueChanged(scale, scale.get_value());
        }

        if (instance.isControlled()) {
            scale.set_value(instance.appliedValue);
        }
    };
}

module.exports = function (imports) {
    const GtkRange = require('./GtkRange')(imports);
    const GObject = imports.gi.GObject;

    return class GtkScale extends GtkRange {
        get InternalType() {
            return imports.gi.Gtk.Scale;
        }

        constructor(props, ...args) {
            const appliedProps = R.omit([ 'onValueChanged', 'value' ], props);

            super(appliedProps, ...args);

            this.update({ set: [ [ "onValueChanged", props.onValueChanged ], [ "value", props.value ] ], unset: [] });
        }

        isControlled() {
            return typeof this.appliedValue !== 'undefined';
        }

        update(changes) {
            const { set, unset } = changes;
            const value = set.find(([ prop ]) => prop === 'value');
            const appliedSet = set.map(([ prop, value ]) => {
                if (prop === 'onValueChanged') {
                    return [ prop, wrapOnValueChanged(this, value) ];
                }
                return [ prop, value ];
            });
            const connectedToggleHandlerId = this.instance._connectedSignals['value-changed'];

            if (connectedToggleHandlerId) {
                GObject.signal_handler_block(this.instance, connectedToggleHandlerId);
            }

            super.update({ set: appliedSet, unset });

            if (value) {
                this.appliedValue = value[1];
            }
            if (GObject.signal_handler_is_connected(this.instance, connectedToggleHandlerId)) {
                GObject.signal_handler_unblock(this.instance, connectedToggleHandlerId);
            }

        }
    };
};
