const Reconciler = require('react-reconciler');

module.exports = function (imports, reconciler) {
    const roots = new Map();
    const GtkReconciler = new Reconciler(reconciler);
    const ReactGtk = {
        render(element, callback, container) {
            const containerKey = typeof container === 'undefined' ? callback : container;
            const cb = typeof container !== 'undefined' ? callback : () => {};
            let myRoot = roots.get(containerKey);
            if (!myRoot) {
                myRoot = GtkReconciler.createContainer(containerKey);
                roots.set(container, myRoot);
            }

            GtkReconciler.updateContainer(element, myRoot, null, cb);
            return GtkReconciler.getPublicRootInstance(myRoot);
        },

        unmountComponentAtNode(container) {
            const myRoot = roots.get(container);
            if (myRoot) {
                GtkReconciler.updateContainer(null, myRoot, null, () => {
                    roots.delete(container);
                });
            }
        }
    };

    return ReactGtk;
};
