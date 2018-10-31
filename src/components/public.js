module.exports = function (imports) {
    return {
        'gtk-bin': require('./GtkBin')(imports),
        'gtk-box': require('./GtkBox')(imports),
        'gtk-button': require('./GtkButton')(imports),
        'gtk-entry': require('./GtkEntry')(imports),
        'gtk-hbox': require('./GtkHBox')(imports),
        'gtk-hscale': require('./GtkHScale')(imports),
        'gtk-label': require('./GtkLabel')(imports),
        'gtk-switch': require('./GtkSwitch')(imports),
        'gtk-togglebutton': require('./GtkToggleButton')(imports),
        'gtk-window': require('./GtkWindow')(imports),
        'gtk-vbox': require('./GtkVBox')(imports),
        'gtk-vscale': require('./GtkVScale')(imports)
    };
};
