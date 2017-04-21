var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    util: require('/lib/enonic/util'),
    utilities: require('/lib/utilities')
};

// Handle GET request
exports.get = handleGet;

function handleGet(req) {
    var component = libs.portal.getComponent();
    var view = resolve('fp-why.html');
    var model = createModel();

    function createModel() {
        var model = {};

        model.heading = component.config.heading;

        model.button = getButtonData();
        model.features = getFeatures();

        return model;
    }

    function getButtonData() {
        var button = {};

        if (component.config.button) {
            button.text = component.config.button.text;
            button.url = libs.utilities.getLinkUrl(component.config.button.linkPage, component.config.button.linkUrl);
        }
        return button;
    }

    function getFeatures() {
        component.config.feature = libs.util.data.forceArray(component.config.feature);
        component.config.feature = libs.util.data.trimArray(component.config.feature);

        return component.config.feature;
    }

    return {
        body: libs.thymeleaf.render(view, model)
    };
}