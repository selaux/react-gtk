const runApp = require('./runApp');
const React = require('react');
const h = React.createElement;

const InputsApp = React.createClass({
    getInitialState() {
        return { disableEvent: false, value: 0, increment: 1 };
    },

    render() {
        return h('GtkWindow', { title: 'react-gtk events test', defaultWidth: 200, defaultHeight: 100 },
            h('GtkVBox', {}, [
                h('GtkHBox', { key: 0 }, [
                    h('GtkToggleButton', { label: 'Toggle me' }),
                    h('GtkButton', { label: 'Set Value' })
                ]),
                h('GtkHBox', { key: 1 }, [
                    h('GtkSpinButton', {}),
                    h('GtkButton', { label: 'Set Value' })
                ]),
                h('GtkHBox', { key: 2 }, [
                    h('GtkSwitch', {}),
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
