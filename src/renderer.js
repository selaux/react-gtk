const R = require('ramda');
const ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler');

function log(...args) {
    if (process.env.DEBUG_REACT_GTK) {
        print(...args);
    }
}

function getPath(path, obj) {
    let current = obj;
    path.forEach(function(p) { current = current[p]; });
    return current;
}

module.exports = function (imports) {
    const Gtk = imports.gi.Gtk;
    const GtkReconciler = ReactFiberReconciler({
        // the tree creation and updating methods. If you’re familiar with the DOM API
        // this will look familiar

        createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
            log('createInstance', type, props);

            const path = type.split('.');
            const Type = getPath(path, imports.gi);

            const appliedProps = R.pipe(
                R.omit([ 'children' ]),
                R.when(R.always(type === 'Gtk.ApplicationWindow'), R.assoc('application', rootContainerInstance))
            )(props);
            const instance = new Type(appliedProps);
            instance.show_all();

            return instance;
        },

        // this is called instead of `appendChild` when the parentInstance is first
        // being created and mounted
        // added in https://github.com/facebook/react/pull/8400/
        appendInitialChild(parentInstance, child) {
            log('appendInitialChild', parentInstance, child);
            if (R.is(Gtk.ApplicationWindow, parentInstance)) {
                parentInstance.add(child);
            }
        },


        appendChild(parentInstance, child) {
            log('appendChild', parentInstance, child);
            if (R.is(Gtk.ApplicationWindow, parentInstance)) {
                parentInstance.add(child);
            }
        },

        removeChild(parentInstance, child) {
            log('removeChild', parentInstance, child);
            // parentInstance.removeChild(child);
        },

        insertBefore(parentInstance, child, beforeChild) {
            log('insertBefore');
            // parentInstance.insertBefore(child, beforeChild);
        },

        // finalizeInitialChildren is the final HostConfig method called before
        // flushing the root component to the host environment

        finalizeInitialChildren(instance, type, props, rootContainerInstance) {
            log('finalizeInitialChildren');
            return false;
        },

        // prepare update is where you compute the diff for an instance. This is done
        // here to separate computation of the diff to the applying of the diff. Fiber
        // can reuse this work even if it pauses or aborts rendering a subset of the
        // tree.

        prepareUpdate(
            instance,
            type,
            oldProps,
            newProps,
            rootContainerInstance,
            hostContext
        ) {
            log('TODO: prepareUpdate');
            return null;
            // return diffProperties(instance, type, oldProps, newProps, rootContainerInstance, hostContext);
        },

        commitUpdate(
            instance,
            updatePayload,
            type,
            oldProps,
            newProps,
            internalInstanceHandle
        ) {
            // Apply the diff to the DOM node.
            // updateProperties(instance, updatePayload, type, oldProps, newProps);
            log('TODO: updateProperties');
        },

        // commitMount is called after initializeFinalChildren *if*
        // `initializeFinalChildren` returns true.

        commitMount(
            instance,
            type,
            newProps,
            internalInstanceHandle
        ) {
            log('commitMount');
        },

        // HostContext is an internal object or reference for any bookkeeping your
        // renderer may need to do based on current location in the tree. In DOM this
        // is necessary for calling the correct `document.createElement` calls based
        // upon being in an `html`, `svg`, `mathml`, or other context of the tree.

        getRootHostContext(rootContainerInstance) {
            log('getRootHostContext');
            return {};
        },

        getChildHostContext(parentHostContext, type) {
            log('getChildHostContext');
            return parentHostContext;
        },

        // getPublicInstance should be the identity function in 99% of all scenarios.
        // It was added to support the `getNodeMock` functionality for the
        // TestRenderers.

        getPublicInstance(instance) {
            log('getPublicInstance');
            if (instance == null) {
                return null;
            }
            return instance != null && instance.props.toJSON(instance);
        },

        // the prepareForCommit and resetAfterCommit methods are necessary for any
        // global side-effects you need to trigger in the host environment. In
        // ReactDOM this does things like disable the ReactDOM events to ensure no
        // callbacks are fired during DOM manipulations

        prepareForCommit() {
            // log('prepareForCommit');
        },

        resetAfterCommit() {
            // log('resetAfterCommit');
        },

        shouldSetTextContent(props) {
            log('shouldSetTextContent');
            return false
        },

        resetTextContent(instance) {
            log('resetTextContent');
        },

        createTextInstance(
            text,
            rootContainerInstance,
            hostContext,
            internalInstanceHandle
        ) {
            log('createTextInstance');
            return null;
        },

        commitTextUpdate(
            textInstance,
            oldText,
            newText
        ) {
            log('commitTextUpdate');
            // noop
            throw new Error('commitTextUpdate should not be called');
        },

        scheduleAnimationCallback() {
            log('scheduleAnimationCallback');
        },

        scheduleDeferredCallback() {
            log('scheduleDeferredCallback');
        },

        useSyncScheduling: true,
    });

    const ReactGtk = {
        render(element, callback, container) {
            const containerKey = typeof container === 'undefined' ? callback : container;
            const cb = typeof container !== 'undefined' ? callback : () => {};
            let root = roots.get(containerKey);
            if (!root) {
                root = GtkReconciler.createContainer(containerKey);
                roots.set(container, root);
            }

            GtkReconciler.updateContainer(element, root, null, cb);
            return GtkReconciler.getPublicRootInstance(root);
        },

        unmountComponentAtNode(container) {
            const root = roots.get(container);
            if (root) {
                GtkReconciler.updateContainer(null, root, null, () => {
                    roots.delete(container);
            });
            }
        }
    };

    const roots = new Map();
    const emptyObject = {};

    return ReactGtk;
};