function rewriteHandler(instance, handler, mappedHandler, wrappingFn) {
    return ([ prop, value ]) => {
        if (prop === handler) {
            return [ mappedHandler || handler, wrappingFn(instance, value) ];
        }
        return [ prop, value ];
    };
}

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

module.exports = function wrapUpdate(imports, controlScheme, update) {
    const GObject = imports.gi.GObject;
    const { controlledProp, handler, mappedHandler = null, signal, wrappingFn } = controlScheme;

    return function controlledUpdate(changes) {
        const { set, unset } = changes;
        const value = set.find(([ prop ]) => prop === controlledProp);
        const appliedSet = set.map(rewriteHandler(this, handler, mappedHandler, wrappingFn));
        const connectedToggleHandlerId = this.instance._connectedSignals[signal];

        blockHandler(GObject, this.instance, connectedToggleHandlerId);

        update.call(this, { set: appliedSet, unset });
        if (value) {
            this.value = value[1];
        }

        unblockHandler(GObject, this.instance, connectedToggleHandlerId);
    };
};
