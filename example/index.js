const ReactGtk = require('../src/index');
const React = require('react');
const h = React.createElement;

const Gtk = imports.gi.Gtk;
const Application = Gtk.Application;

const MyApp = function() {
    return h('Gtk.ApplicationWindow', { title: 'Test' }, [
        h('Gtk.Label', { label: 'Hello', visible: false })
    ]);
};

Gtk.init(null);

const app = new Application();

app.connect('activate', () => {
    ReactGtk.render(h(MyApp), app);
});

print("Starting app");
app.run([]);