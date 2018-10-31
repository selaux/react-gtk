const R = require('ramda');

const createRenderer = require('./renderer');
const createReconciler = require('./reconciler');
const publicComponents = require('./components/public')(imports);

// Monkeypatch console for react
global.console = { log: print, warn: print, error: print };

function log(...args) {
    if (process.env.DEBUG_REACT_GTK) {
        print(...args);
    }
}

module.exports = R.merge({
    ReactGtk: createRenderer(imports, createReconciler(imports, publicComponents, log))
}, publicComponents);
