const ReactGtk = require('../../../src');
const React = require('react');
const h = React.createElement;

const Gtk = imports.gi.Gtk;
const Application = Gtk.Application;

const MyApp = React.createClass({
    getInitialState () {
        return { disableEvent: false, value: 0, increment: 1 };
    },

    toggleEvent() {
        this.setState({ disableEvent: !this.state.disableEvent });
    },

    increase(inc) {
        this.setState({ value: this.state.value + inc });
    },

    increaseIncrement() {
        this.setState({ increment: this.state.increment + 1 });
    },

    render() {
        const valueLabel = `Value: ${this.state.value}`;
        const buttonLabel = this.state.disableEvent ? 'Enable Event' : 'Disable Event';
        const onClicked = this.state.disableEvent ? null : this.increase.bind(this, this.state.increment);
        const buttonBaseProps = { key: 1, label: 'Increase' };
        const buttonProps = onClicked ? Object.assign(buttonBaseProps, { onClicked }) : buttonBaseProps;

        return h('Gtk.ApplicationWindow', { title: 'react-gtk events test', defaultWidth: 200, defaultHeight: 100 },
            h('Gtk.VBox', {}, [
                h('Gtk.Label',  { key: 0, label: valueLabel }),
                h('Gtk.Button', buttonProps),
                h('Gtk.Button', { key: 2, label: 'Increase Increment', onClicked: this.increaseIncrement }),
                h('Gtk.Button', { key: 3, label: buttonLabel, onClicked: this.toggleEvent })
            ]));
    }
});

Gtk.init(null);

const app = new Application();

app.connect('activate', () => {
    ReactGtk.render(h(MyApp), app);
});
app.run([]);