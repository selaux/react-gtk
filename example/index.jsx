const ReactGtk = require('../src/index');
const React = require('react');
const Component = React.Component;

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

        return <gtk-window title='Increase me' defaultWidth={640} defaultHeight={480}>
            <gtk-vbox>
                <gtk-label label={label} />
                <gtk-button label='Click me!' onClicked={this.increaseClicks.bind(this)} />
            </gtk-vbox>
        </gtk-window>;
    }
}

Gtk.init(null);

const app = new Application();

app.connect('activate', () => {
    ReactGtk.render(<MyApp />, app);
});

print('Starting app');
app.run([]);
