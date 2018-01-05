const runApp = require('./runApp');
const React = require('react');
const R = require('ramda');
const h = React.createElement;
const Component = React.Component;

const shiftArrayToRight = (places) => (a) => {
    const arr = R.clone(a);
    for (let i = 0; i < places; i += 1) {
        arr.unshift(arr.pop());
    }
    return arr;
};

class EventsApp extends Component {
    constructor() {
        super();
        this.state = { all: [ 1, 2, 3, 4 ], removed: [], rotate: 0 };
    }

    rotate(amount) {
        this.setState({ rotate: this.state.rotate + amount });
    }

    toggle(number) {
        this.setState({
            removed: R.ifElse(R.contains(number), R.without([ number ]), R.append(number))(this.state.removed)
        });
    }

    render() {
        const buttons = R.map(
            (i) => h('GtkButton', { key: i, label: `R${i}`, onClicked: this.toggle.bind(this, i) }),
            this.state.all
        );
        const items = R.pipe(
            shiftArrayToRight(this.state.rotate),
            R.without(this.state.removed),
            R.map((i) => h('GtkLabel', { key: i, label: `This is ${i}` }))
        )(this.state.all);

        return h('GtkWindow', { title: 'react-gtk children test', defaultWidth: 200, defaultHeight: 100 },
            h('GtkVBox', {}, [
                h('GtkHBox', {}, [
                    h('GtkButton', { key: -1, label: 'UP', onClicked: this.rotate.bind(this, -1) }),
                    h('GtkButton', { key: -2, label: 'DOWN', onClicked: this.rotate.bind(this, +1) }),
                    ...buttons
                ]),
                h('GtkVBox', {}, items)
            ]));
    }
}

runApp(EventsApp);
