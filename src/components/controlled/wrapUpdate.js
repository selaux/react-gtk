const R = require('ramda');

function blockHandler(GObject, instance, id) {
    if (id) {
        GObject.signal_handler_block(instance, id);
    }
}

function unblockHandler(GObject, instance, id) {
    if (GObject.signal_handler_is_connected(instance, id)) {
        GObject.signal_handler_unblock(instance, id);
    }
}

function rewriteHandler(GObject, input, signal, wrappingFn, handler) {
    const outerWrappingFn = (value) => (...args) => {
        const handlerToBlock = input.instance._connectedSignals[signal];

        blockHandler(GObject, input.instance, handlerToBlock);
        const r = wrappingFn(input, value)(...args);
        unblockHandler(GObject, input.instance, handlerToBlock);

        return r;
    };
    return outerWrappingFn(handler);
}

module.exports = function wrapUpdate(imports, controlScheme, update) {
    const GObject = imports.gi.GObject;
    const { controlledProp, handler, mappedHandler, signal, wrappingFn } = controlScheme;

    return function controlledUpdate(changes) {
        const { set, unset } = changes;
        const valueSet = set.find(([ prop ]) => prop === controlledProp);
        const handlerSet = set.find(([ prop ]) => prop === handler);
        const appliedHandlerSet = [
            mappedHandler || handler,
            rewriteHandler(GObject, this, signal, wrappingFn, R.propOr(() => {}, 1, handlerSet))
        ];
        const appliedSet = R.pipe(R.without([ handlerSet ]), R.append(appliedHandlerSet))(set);
        const handlerToBlock = this.instance._connectedSignals[signal];

        blockHandler(GObject, this.instance, handlerToBlock);

        update.call(this, { set: appliedSet, unset });
        if (valueSet) {
            this.value = valueSet[1];
        }

        unblockHandler(GObject, this.instance, handlerToBlock);
    };
};
