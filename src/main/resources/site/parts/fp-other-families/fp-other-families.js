var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    util: require('/lib/enonic/util')
};

// Handle GET request
exports.get = handleGet;

function handleGet(req) {
    var component = libs.portal.getComponent();
    var view = resolve('fp-other-families.html');
    var model = createModel();

    function createModel() {
        var model = {};

        model.heading = component.config.heading;
        model.quotes = getQuotes();

        return model;
    }

    function getQuotes() {
        component.config.quote = libs.util.data.forceArray(component.config.quote);
        component.config.quote = libs.util.data.trimArray(component.config.quote);

        return component.config.quote;
    }

    return {
        body: libs.thymeleaf.render(view, model)
    };
}