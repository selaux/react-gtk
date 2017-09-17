module.exports = function (imports) {
    return {
        GtkBin: require('./GtkBin')(imports),
        GtkBox: require('./GtkBox')(imports),
        GtkButton: require('./GtkButton')(imports),
        GtkEntry: require('./GtkEntry')(imports),
        GtkHBox: require('./GtkHBox')(imports),
        GtkHScale: require('./GtkHScale')(imports),
        GtkLabel: require('./GtkLabel')(imports),
        GtkSpinButton: require('./GtkSpinButton')(imports),
        GtkSwitch: require('./GtkSwitch')(imports),
        GtkToggleButton: require('./GtkToggleButton')(imports),
        GtkWindow: require('./GtkWindow')(imports),
        GtkVBox: require('./GtkVBox')(imports),
        GtkVScale: require('./GtkVScale')(imports)
    };
};
