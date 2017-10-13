const R = require('ramda');
const isControlled = require('./controlled/isControlled');
const wrapUpdate = require('./controlled/wrapUpdate');

function wrapOnValueChanged(instance, onValueChanged) {
    return function wrappedOnValueChanged(scale) {
        if (onValueChanged) {
            onValueChanged(scale, scale.get_value());
        }

        if (instance.isControlled()) {
            scale.set_value(instance.value);
        }
    };
}

module.exports = function (imports) {
    const GtkRange = require('./GtkRange')(imports);

    return class GtkScale extends GtkRange {
        get InternalType() {
            return imports.gi.Gtk.Scale;
        }

        constructor(props, ...args) {
            const appliedProps = R.omit([ 'onValueChanged', 'value' ], props);
            const set = [
                [ 'onValueChanged', props.onValueChanged || (() => {}) ],
                [ 'value', props.value ]
            ].filter(([ , value ]) => typeof value !== 'undefined');

            super(appliedProps, ...args);

            this.isControlled = isControlled.bind(this);
            this.update = wrapUpdate(imports, {
                controlledProp: 'value',
                handler: 'onValueChanged',
                signal: 'value-changed',
                wrappingFn: wrapOnValueChanged
            }, this.update);

            this.update({ set, unset: [] });
        }
    };
};
