const ReactGtk = require('../../../src');
const React = require('react');
const h = React.createElement;

const Gtk = imports.gi.Gtk;
const Application = Gtk.Application;

module.exports = function (AppComponent) {
    Gtk.init(null);

    const app = new Application();

    app.connect('activate', () => {
        ReactGtk.render(h(AppComponent), app);
    });
    app.run([]);
};
