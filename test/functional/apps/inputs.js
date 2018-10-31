const runApp = require('./runApp');
const React = require('react');
const h = React.createElement;
const Component = React.Component;

class InputsApp extends Component {
    constructor() {
        super();
        this.state = {
            fixedValues: false,
            toggleButtonActive: false,
            switchActive: false,
            scaleValue: 0,
            entryText: 'My Text'
        };
    }

    toggleFixedValues() {
        this.setState({ fixedValues: !this.state.fixedValues });
    }

    onToggleButton(btn, toggled) {
        if (!this.state.fixedValues) {
            this.setState({ toggleButtonActive: toggled });
        }
    }

    setToggleButtonActive() {
        this.setState({ toggleButtonActive: true });
    }

    onSwitch(sw, active) {
        if (!this.state.fixedValues) {
            this.setState({ switchActive: active });
        }
    }

    setSwitchActive() {
        this.setState({ switchActive: true });
    }

    onScale(scale, value) {
        if (!this.state.fixedValues) {
            this.setState({ scaleValue: value });
        }
    }

    setScaleValue() {
        this.setState({ scaleValue: 3 });
    }

    onEntry(entry) {
        if (!this.state.fixedValues) {
            this.setState({ entryText: entry.get_text() });
        }
    }

    setEntryText() {
        this.setState({ entryText: 'Set Text' });
    }

    render() {
        return h('gtk-window', { title: 'react-gtk inputs test', defaultWidth: 200, defaultHeight: 100 },
            h('gtk-vbox', {}, [
                h('gtk-button', {
                    label: this.state.fixedValues ? 'Unfix Values' : 'Fix Values',
                    onClicked: this.toggleFixedValues.bind(this)
                }),
                h('gtk-hbox', { key: 0 }, [
                    h('gtk-togglebutton', {
                        label: 'Toggle Me',
                        onToggled: this.onToggleButton.bind(this),
                        active: this.state.toggleButtonActive
                    }),
                    h('gtk-label', { label: this.state.toggleButtonActive.toString() }),
                    h('gtk-button', { label: 'Activate Toggle', onClicked: this.setToggleButtonActive.bind(this) })
                ]),
                h('gtk-hbox', { key: 1 }, [
                    h('gtk-switch', {
                        active: this.state.switchActive,
                        onToggled: this.onSwitch.bind(this)
                    }),
                    h('gtk-label', { label: this.state.switchActive.toString() }),
                    h('gtk-button', { label: 'Activate Switch', onClicked: this.setSwitchActive.bind(this) })
                ]),
                h('gtk-hbox', { key: 2 }, [
                    h('gtk-hscale', {
                        drawValue: true,
                        lower: -5,
                        upper: 5,
                        stepIncrement: 1,
                        value: this.state.scaleValue,
                        onValueChanged: this.onScale.bind(this)
                    }),
                    h('gtk-label', { label: this.state.scaleValue.toString() }),
                    h('gtk-button', { label: 'Set Scale', onClicked: this.setScaleValue.bind(this) })
                ]),
                h('gtk-hbox', { key: 3 }, [
                    h('gtk-entry', { text: this.state.entryText, onChanged: this.onEntry.bind(this) }),
                    h('gtk-label', { label: this.state.entryText }),
                    h('gtk-button', { label: 'Set Entry', onClicked: this.setEntryText.bind(this) })
                ])
            ]));
    }
}

runApp(InputsApp);
