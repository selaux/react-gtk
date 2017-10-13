const R = require('ramda');
const isControlled = require('./controlled/isControlled');
const wrapUpdate = require('./controlled/wrapUpdate');

function wrapOnToggled(instance, onToggled) {
    return function wrappedOnToggled(btn) {
        const active = btn.get_active();

        if (onToggled) {
            onToggled(btn, active);
        }

        if (instance.isControlled()) {
            btn.set_active(instance.value);
        }
    };
}

module.exports = function (imports) {
    const GtkButton = require('./GtkButton')(imports);

    return class GtkToggleButton extends GtkButton {
        get InternalType() {
            return imports.gi.Gtk.ToggleButton;
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
                signal: 'toggled',
                wrappingFn: wrapOnToggled
            }, this.update);

            this.update({ set, unset: [] });
        }
    };
};
