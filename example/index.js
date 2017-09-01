const ReactGtk = require('../src/index');
const React = require('react');
const R = require('ramda');
const h = React.createElement;

const Gtk = imports.gi.Gtk;
const Application = Gtk.Application;
const Mainloop = imports.mainloop;

const MyApp = React.createClass({
    getInitialState () {
        return { clicks: 0 };
    },

    increaseClicks() {
        this.setState({ clicks: this.state.clicks + 1 });
    },

    render() {
        const label = `${this.state.clicks} Click${this.state.clicks === 1 ? '' : 's'}`;

        return h('Gtk.ApplicationWindow', { title: 'Increase me' },
            h('Gtk.Button', { label, onClicked: this.increaseClicks })
        );
    }
});

Gtk.init(null);

const app = new Application();

app.connect('activate', () => {
    ReactGtk.render(h(MyApp), app);
});

print("Starting app");
app.run([]);