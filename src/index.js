const createRenderer = require('./renderer');
const createReconciler = require('./reconciler');

global.console = { log: print, warn: print, error: print };

module.exports = createRenderer(imports, createReconciler);