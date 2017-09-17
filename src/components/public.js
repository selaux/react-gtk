module.exports = function (imports) {
    return {
        GtkBin: require('./GtkBin')(imports),
        GtkBox: require('./GtkBox')(imports),
        GtkButton: require('./GtkButton')(imports),
        GtkHBox: require('./GtkHBox')(imports),
        GtkLabel: require('./GtkLabel')(imports),
        GtkWindow: require('./GtkWindow')(imports),
        GtkVBox: require('./GtkVBox')(imports)
    };
};
