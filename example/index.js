const ReactGtk = require('../src/index');
const React = require('react');
const Component = React.Component;
const h = React.createElement;

const Gtk = imports.gi.Gtk;
const Application = Gtk.Application;

class MyApp extends Component {
    constructor() {
        super();
        this.state = { clicks: 0 };
    }

    increaseClicks() {
        this.setState({ clicks: this.state.clicks + 1 });
    }

    render() {
        const label = `${this.state.clicks} Click${this.state.clicks === 1 ? '' : 's'}`;

        return h('GtkWindow', { title: 'Increase me', defaultWidth: 640, defaultHeight: 480 },
            h('GtkVBox', {}, [
                h('GtkLabel', { label }),
                h('GtkButton', { label: 'Click me!', onClicked: this.increaseClicks.bind(this) })
            ])
        );
    }
}

Gtk.init(null);

const app = new Application();

app.connect('activate', () => {
    ReactGtk.render(h(MyApp), app);
});

print('Starting app');
app.run([]);
