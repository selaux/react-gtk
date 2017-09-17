/* eslint no-unused-vars: 0 */

const R = require('ramda');

const withoutChildren = R.omit([ 'children' ]);

const stringify = JSON.stringify;

module.exports = function (imports, publicComponents, log) {
    const Gtk = imports.gi.Gtk;

    const GtkReconciler = {
        // the tree creation and updating methods. If you’re familiar with the DOM API
        // this will look familiar

        createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
            log('createInstance', type, props);
            const Type = publicComponents[type];
            return new Type(props, rootContainerInstance, hostContext, internalInstanceHandle);
        },

        // this is called instead of `appendChild` when the parentInstance is first
        // being created and mounted
        // added in https://github.com/facebook/react/pull/8400/
        appendInitialChild(parentInstance, child) {
            log('appendInitialChild', parentInstance, child);
            child.instance.show();

            if (!R.is(Gtk.Application, parentInstance)) {
                parentInstance.appendChild(child);
            }
        },

        appendChild(parentInstance, child) {
            log('appendChild', parentInstance, child);
            child.instance.show();
            if (!R.is(Gtk.Application, parentInstance)) {
                parentInstance.appendChild(child);
            }
        },

        removeChild(parentInstance, child) {
            log('removeChild', parentInstance, child);
            if (!R.is(Gtk.Application, parentInstance)) {
                parentInstance.removeChild(child);
            }
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
            const oldNoChildren = withoutChildren(oldProps);
            const newNoChildren = withoutChildren(newProps);
            const propsAreEqual = R.equals(oldNoChildren, newNoChildren);
            const unset = R.without(R.keys(newNoChildren), R.keys(oldNoChildren));
            const set = R.reject(R.contains(R.__, R.toPairs(oldNoChildren)), R.toPairs(newNoChildren));

            log('prepareUpdate', stringify(oldNoChildren), stringify(newNoChildren), !propsAreEqual);
            return propsAreEqual ? null : { unset, set };
        },

        commitUpdate(
            instance,
            changes,
            type,
            oldProps,
            newProps,
            internalInstanceHandle
        ) {
            log('commitUpdate', stringify(changes));
            instance.update(changes);
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
            // log('getRootHostContext');
            return {};
        },

        getChildHostContext(parentHostContext, type) {
            // log('getChildHostContext');
            return parentHostContext;
        },

        // getPublicInstance should be the identity function in 99% of all scenarios.
        // It was added to support the `getNodeMock` functionality for the
        // TestRenderers.

        getPublicInstance(instance) {
            log('getPublicInstance');
            return instance;
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
            // log('shouldSetTextContent');
            return false;
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

        useSyncScheduling: true
    };

    return GtkReconciler;
};
