const R = require('ramda');
const isControlled = require('./controlled/isControlled');
const wrapUpdate = require('./controlled/wrapUpdate');

function wrapOnChanged(instance, onChanged) {
    return function wrappedonChanged(entry) {
        if (onChanged) {
            onChanged(entry, entry.get_text());
        }

        if (instance.isControlled()) {
            entry.set_text(instance.value);
        }
    };
}

module.exports = function (imports) {
    const GtkWidget = require('./GtkWidget')(imports);

    return class GtkEntry extends GtkWidget {
        get InternalType() {
            return imports.gi.Gtk.Entry;
        }

        constructor(props, ...args) {
            const appliedProps = R.omit([ 'onChanged', 'text' ], props);
            const set = [
                [ 'onChanged', props.onChanged ],
                [ 'text', props.text ]
            ].filter(([ , value ]) => typeof value !== 'undefined');

            super(appliedProps, ...args);

            this.isControlled = isControlled.bind(this);
            this.update = wrapUpdate(imports, {
                controlledProp: 'text',
                handler: 'onChanged',
                signal: 'changed',
                wrappingFn: wrapOnChanged
            }, this.update);

            this.update({ set, unset: [] });
        }
    };
};
