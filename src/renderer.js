const ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler');

module.exports = function (imports, createReconciler) {
    const GtkReconciler = ReactFiberReconciler(createReconciler(imports));
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

    return ReactGtk;
};