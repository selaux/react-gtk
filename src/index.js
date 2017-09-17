const createRenderer = require('./renderer');
const createReconciler = require('./reconciler');

// Monkeypatch console for react
global.console = { log: print, warn: print, error: print };

function log(...args) {
    if (process.env.DEBUG_REACT_GTK) {
        print(...args);
    }
}

module.exports = createRenderer(imports, createReconciler(imports, log));
