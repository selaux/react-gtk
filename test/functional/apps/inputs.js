const runApp = require('./runApp');
const React = require('react');
const h = React.createElement;

const InputsApp = React.createClass({
    getInitialState() {
        return { toggleButtonActive: false, switchActive: false };
    },

    onToggleButtonActive(btn) {
        this.setState({ toggleButtonActive: btn.get_active() });
    },

    setToggleButtonActive() {
        this.setState({ toggleButtonActive: true })
    },

    onSwitchSwitched(sw, active) {
        this.setState({ switchActive: active });
    },

    setSwitchActive() {
        this.setState({ switchActive: true })
    },

    render() {
        return h('GtkWindow', { title: 'react-gtk inputs test', defaultWidth: 200, defaultHeight: 100 },
            h('GtkVBox', {}, [
                h('GtkHBox', { key: 0 }, [
                    h('GtkToggleButton', { label: 'Toggle me', onToggled: this.onToggleButtonActive, active: this.state.toggleButtonActive }),
                    h('GtkButton', { label: 'Set To Active', onClicked: this.setToggleButtonActive })
                ]),
                h('GtkHBox', { key: 1 }, [
                    h('GtkSwitch', { active: this.state.switchActive, onStateSet: this.onSwitchSwitched }),
                    h('GtkButton', { label: 'Set To Active', onClicked: this.setSwitchActive })
                ]),
                h('GtkHBox', { key: 2 }, [
                    h('GtkSpinButton', {}),
                    h('GtkButton', { label: 'Set Value' })
                ]),
                h('GtkHBox', { key: 3 }, [
                    h('GtkHScale', { drawValue: true }),
                    h('GtkButton', { label: 'Set Value' })
                ]),
                h('GtkHBox', { key: 4 }, [
                    h('GtkEntry', {}),
                    h('GtkButton', { label: 'Set Value' })
                ])
            ]));
    }
});

runApp(InputsApp);
