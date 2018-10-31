const runApp = require('./runApp');
const React = require('react');
const h = React.createElement;
const Component = React.Component;

class EventsApp extends Component {
    constructor() {
        super();
        this.state = { disableEvent: false, value: 0, increment: 1 };
    }

    toggleEvent() {
        this.setState({ disableEvent: !this.state.disableEvent });
    }

    increase(inc) {
        this.setState({ value: this.state.value + inc });
    }

    increaseIncrement() {
        this.setState({ increment: this.state.increment + 1 });
    }

    render() {
        const valueLabel = `Value: ${this.state.value}`;
        const buttonLabel = this.state.disableEvent ? 'Enable Event' : 'Disable Event';
        const onClicked = this.state.disableEvent ? null : this.increase.bind(this, this.state.increment);
        const buttonBaseProps = { key: 1, label: 'Increase' };
        const buttonProps = onClicked ? Object.assign(buttonBaseProps, { onClicked }) : buttonBaseProps;

        return h('gtk-window', { title: 'react-gtk events test', defaultWidth: 200, defaultHeight: 100 },
            h('gtk-vbox', {}, [
                h('gtk-label', { key: 0, label: valueLabel }),
                h('gtk-button', buttonProps),
                h('gtk-button', { key: 2, label: 'Increase Increment', onClicked: this.increaseIncrement.bind(this) }),
                h('gtk-button', { key: 3, label: buttonLabel, onClicked: this.toggleEvent.bind(this) })
            ]));
    }
}

runApp(EventsApp);
