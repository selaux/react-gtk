const createRenderer = require('./renderer');
const createReconciler = require('./reconciler');
const publicComponents = require('./components/public')(imports);

function log(...args) {
    print(...args);
}

module.exports = createRenderer(imports, createReconciler(imports, publicComponents, log));
