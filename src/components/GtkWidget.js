const R = require('ramda');
const kebabCase = require('just-kebab-case');
const updateProperties = require('../lib/updateProperties');

const withoutChildren = R.omit([ 'children' ]);

function propNameToSignal(handlerName) {
    return handlerName.slice(2).split('::').map(kebabCase).join('::');
}

function isSignalHandler(GObject, type, propName) {
    return R.startsWith('on', propName) && GObject.signal_lookup(propNameToSignal(propName).split('::')[0], type) !== 0;
}

function getSignalHandlersFromProps(GObject, type, props) {
    return R.pipe(
        R.keys,
        R.filter(R.partial(isSignalHandler, [ GObject, type ]))
    )(props);
}

function updateSignalHandlers(instance, set, unset) {
    /* eslint-disable no-param-reassign */
    const disconnect = (signalName) => {
        if (typeof instance._connectedSignals[signalName] !== 'undefined') {
            instance.disconnect(instance._connectedSignals[signalName]);
            delete instance._connectedSignals[signalName];
        }
    };
    const connect = (signalName, fn) => {
        instance._connectedSignals[signalName] = instance.connect(signalName, fn);
    };
    instance._connectedSignals = instance._connectedSignals || {};

    R.forEach(R.pipe(propNameToSignal, disconnect), unset);
    R.pipe(
        R.toPairs,
        R.forEach(([ name, fn ]) => {
            const signalName = propNameToSignal(name);
            disconnect(signalName);
            connect(signalName, fn);
        })
    )(set);
    /* eslint-enable no-param-reassign */
}

module.exports = function (imports) {
    const Gtk = imports.gi.Gtk;
    const GObject = imports.gi.GObject;

    return class GtkWidget {
        get InternalType() {
            return Gtk.Widget;
        }

        constructor(props) {
            const signalHandlers = getSignalHandlersFromProps(GObject, this.InternalType, props);

            const appliedProps = R.pipe(
                R.omit(signalHandlers),
                withoutChildren
            )(props);
            const instance = new this.InternalType(appliedProps);

            updateSignalHandlers(instance, R.pick(signalHandlers, props), []);

            this.instance = instance;
        }

        appendChild() {
            throw new Error(`Cannot add children to a ${ this.InternalType}`);
        }

        insertBefore() {
            throw new Error(`Cannot add children to a ${ this.InternalType}`);
        }

        removeChild() {
            throw new Error(`Cannot remove children from a ${ this.InternalType}`);
        }

        update(changes) {
            const isValidHandler = R.partial(isSignalHandler, [ GObject, this.InternalType ]);
            const signalHandlersToSet = R.pipe(
                R.filter(R.pipe(R.head, isValidHandler)),
                R.fromPairs
            )(changes.set);
            const signalHandlersToUnset = R.filter(isValidHandler, changes.unset);

            // Make properties apply first, so change handlers wont get triggered by updates -- hacky
            updateProperties(this.instance, changes.set, changes.unset);
            updateSignalHandlers(this.instance, signalHandlersToSet, signalHandlersToUnset);
        }
    };
};
