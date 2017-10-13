const R = require('ramda');
const isControlled = require('./controlled/isControlled');
const wrapUpdate = require('./controlled/wrapUpdate');

function wrapOnToggled(instance, onToggled) {
    return function wrappedOnToggled(btn) {
        if (onToggled) {
            onToggled(btn, btn.get_active());
        }

        if (instance.isControlled()) {
            btn.set_active(instance.value);
        }

        return true;
    };
}

module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);

    return class GtkSwitch extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Switch;
        }

        constructor(props, ...args) {
            const appliedProps = R.omit([ 'onToggled', 'active' ], props);
            const set = [
                [ 'onToggled', props.onToggled || (() => {}) ],
                [ 'active', props.active ]
            ].filter(([ , value ]) => typeof value !== 'undefined');

            super(appliedProps, ...args);

            this.isControlled = isControlled.bind(this);
            this.update = wrapUpdate(imports, {
                controlledProp: 'active',
                handler: 'onToggled',
                mappedHandler: 'onNotify::active',
                signal: 'notify::active',
                wrappingFn: wrapOnToggled
            }, this.update);

            this.update({ set, unset: [] });
        }
    };
};
