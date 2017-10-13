const R = require('ramda');

function wrapOnToggled(instance, onToggled) {
    return function wrappedOnToggled(btn) {
        const active = btn.get_active();

        if (onToggled) {
            onToggled(btn, active);
        }

        if (instance.isControlled()) {
            btn.set_active(instance.appliedActive);
        }
    };
}

module.exports = function (imports) {
    const GtkButton = require('./GtkButton')(imports);
    const GObject = imports.gi.GObject;

    return class GtkToggleButton extends GtkButton {
        get InternalType() {
            return imports.gi.Gtk.ToggleButton;
        }

        constructor(props, ...args) {
            const appliedProps = R.omit([ 'onToggled', 'active' ], props);

            super(appliedProps, ...args);

            this.update({ set: [ [ 'onToggled', props.onToggled ], [ 'active', props.active ] ], unset: [] });
        }

        isControlled() {
            return typeof this.appliedActive !== 'undefined';
        }

        update(changes) {
            const { set, unset } = changes;
            const active = set.find(([ prop ]) => prop === 'active');
            const appliedSet = set.map(([ prop, value ]) => {
                if (prop === 'onToggled') {
                    return [ prop, wrapOnToggled(this, value) ];
                }
                return [ prop, value ];
            });
            const connectedToggleHandlerId = this.instance._connectedSignals.toggled;

            if (connectedToggleHandlerId) {
                GObject.signal_handler_block(this.instance, connectedToggleHandlerId);
            }

            super.update({ set: appliedSet, unset });

            if (active) {
                this.appliedActive = active[1];
            }
            if (GObject.signal_handler_is_connected(this.instance, connectedToggleHandlerId)) {
                GObject.signal_handler_unblock(this.instance, connectedToggleHandlerId);
            }
        }
    };
};
