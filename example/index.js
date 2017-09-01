const ReactGtk = require('../src/index');
const React = require('react');
const R = require('ramda');
const h = React.createElement;

const Gtk = imports.gi.Gtk;
const Application = Gtk.Application;
const Mainloop = imports.mainloop;

const MyApp = React.createClass({
    getInitialState () {
        return { ticks: 0 };
    },

    runInterval() {
        this.interval = Mainloop.timeout_add(1000, () => {
            this.setState({ ticks: this.state.ticks + 1 });
            return true;
        });
    },

    componentDidMount() {
        this.runInterval();
    },

    render() {
        const isOdd = this.state.ticks % 2 === 1;
        const alignStart = R.assoc('valign', Gtk.Align.START);
        const labelProps = R.when(R.always(isOdd), alignStart)({ label: 'Hello ' + this.state.ticks });

        return h('Gtk.ApplicationWindow', { title: 'Test' }, [
            h('Gtk.Label', labelProps)
        ]);
            // h('Gtk.Window', { title: 'Test' }, [
            //     h('Gtk.Button', { label: 'Hello' })
            // ]),
            // h('Gtk.AboutDialog', { 'program-name': 'Hello World' });
    }
});

Gtk.init(null);

const app = new Application();

app.connect('activate', () => {
    ReactGtk.render(h(MyApp), app);
});

print("Starting app");
app.run([]);