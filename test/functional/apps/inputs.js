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
        return h('GtkWindow', { title: 'react-gtk inputs test', defaultWidth: 200, defaultHeight: 100 },
            h('GtkVBox', {}, [
                h('GtkButton', {
                    label: this.state.fixedValues ? 'Unfix Values' : 'Fix Values',
                    onClicked: this.toggleFixedValues.bind(this)
                }),
                h('GtkHBox', { key: 0 }, [
                    h('GtkToggleButton', {
                        label: 'Toggle Me',
                        onToggled: this.onToggleButton.bind(this),
                        active: this.state.toggleButtonActive
                    }),
                    h('GtkLabel', { label: this.state.toggleButtonActive.toString() }),
                    h('GtkButton', { label: 'Activate Toggle', onClicked: this.setToggleButtonActive.bind(this) })
                ]),
                h('GtkHBox', { key: 1 }, [
                    h('GtkSwitch', {
                        active: this.state.switchActive,
                        onToggled: this.onSwitch.bind(this)
                    }),
                    h('GtkLabel', { label: this.state.switchActive.toString() }),
                    h('GtkButton', { label: 'Activate Switch', onClicked: this.setSwitchActive.bind(this) })
                ]),
                h('GtkHBox', { key: 2 }, [
                    h('GtkHScale', {
                        drawValue: true,
                        lower: -5,
                        upper: 5,
                        stepIncrement: 1,
                        value: this.state.scaleValue,
                        onValueChanged: this.onScale.bind(this)
                    }),
                    h('GtkLabel', { label: this.state.scaleValue.toString() }),
                    h('GtkButton', { label: 'Set Scale', onClicked: this.setScaleValue.bind(this) })
                ]),
                h('GtkHBox', { key: 3 }, [
                    h('GtkEntry', { text: this.state.entryText, onChanged: this.onEntry.bind(this) }),
                    h('GtkLabel', { label: this.state.entryText }),
                    h('GtkButton', { label: 'Set Entry', onClicked: this.setEntryText.bind(this) })
                ])
            ]));
    }
}

runApp(InputsApp);
