module.exports = function updateProperties(instance, set, unset) {
    /* eslint-disable no-param-reassign */
    set.forEach(([ property, value ]) => {
        instance[property] = value;
    });
    unset.forEach((property) => {
        instance[property] = null;
    });
    /* eslint-enable no-param-reassign */
};
