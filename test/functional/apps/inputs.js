const runApp = require('./runApp');
const React = require('react');
const h = React.createElement;

const InputsApp = React.createClass({
    getInitialState() {
        return {
            fixedValues: false,
            toggleButtonActive: false,
            switchActive: false,
            scaleValue: 0,
            entryText: 'My Text',
            spinbuttonValue: 0
        };
    },

    toggleFixedValues() {
        this.setState({ fixedValues: !this.state.fixedValues });
    },

    onToggleButton(btn, toggled) {
        if (!this.state.fixedValues) {
            this.setState({ toggleButtonActive: toggled });
        }
    },

    setToggleButtonActive() {
        this.setState({ toggleButtonActive: true });
    },

    onSwitch(sw, active) {
        if (!this.state.fixedValues) {
            this.setState({ switchActive: active });
        }
    },

    setSwitchActive() {
        this.setState({ switchActive: true });
    },

    onScale(scale, value) {
        if (!this.state.fixedValues) {
            this.setState({ scaleValue: value });
        }
    },

    setScaleValue() {
        this.setState({ scaleValue: 3 });
    },

    onEntry(entry) {
        if (!this.state.fixedValues) {
            this.setState({ entryText: entry.get_text() });
        }
    },

    setEntryText() {
        this.setState({ entryText: 'Set Text' });
    },

    onSpinButton(sb) {
        if (!this.state.fixedValues) {
            this.setState({ spinbuttonValue: sb.get_value() });
        }
    },

    setSpinButtonValue() {
        this.setState({ spinbuttonValue: 3 });
    },

    render() {
        return h('GtkWindow', { title: 'react-gtk inputs test', defaultWidth: 200, defaultHeight: 100 },
            h('GtkVBox', {}, [
                h('GtkButton', {
                    label: this.state.fixedValues ? 'Unfix Values' : 'Fix Values',
                    onClicked: this.toggleFixedValues
                }),
                h('GtkHBox', { key: 0 }, [
                    h('GtkToggleButton', {
                        label: 'Toggle Me',
                        onToggled: this.onToggleButton,
                        active: this.state.toggleButtonActive
                    }),
                    h('GtkLabel', { label: this.state.toggleButtonActive.toString() }),
                    h('GtkButton', { label: 'Activate Toggle', onClicked: this.setToggleButtonActive })
                ]),
                h('GtkHBox', { key: 1 }, [
                    h('GtkSwitch', {
                        active: this.state.switchActive,
                        onToggled: this.onSwitch
                    }),
                    h('GtkLabel', { label: this.state.switchActive.toString() }),
                    h('GtkButton', { label: 'Activate Switch', onClicked: this.setSwitchActive })
                ]),
                h('GtkHBox', { key: 2 }, [
                    h('GtkHScale', {
                        drawValue: true,
                        lower: -5,
                        upper: 5,
                        stepIncrement: 1,
                        value: this.state.scaleValue,
                        onValueChanged: this.onScale
                    }),
                    h('GtkLabel', { label: this.state.scaleValue.toString() }),
                    h('GtkButton', { label: 'Set Scale', onClicked: this.setScaleValue })
                ]),
                h('GtkHBox', { key: 3 }, [
                    h('GtkEntry', { text: this.state.entryText, onChanged: this.onEntry }),
                    h('GtkLabel', { label: this.state.entryText }),
                    h('GtkButton', { label: 'Set Entry', onClicked: this.setEntryText })
                ]),
                h('GtkHBox', { key: 4 }, [
                    h('GtkSpinButton', {
                        lower: -5,
                        upper: 5,
                        stepIncrement: 1,
                        value: this.state.spinbuttonValue,
                        onChanged: this.onSpinButton
                    }),
                    h('GtkLabel', { label: this.state.spinbuttonValue.toString() }),
                    h('GtkButton', { label: 'Set Spin Button', onClicked: this.setSpinButtonValue })
                ])
            ]));
    }
});

runApp(InputsApp);
