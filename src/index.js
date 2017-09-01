const createRenderer = require('./renderer');

global.console = { log: print, warn: print, error: print };

module.exports = createRenderer(imports);