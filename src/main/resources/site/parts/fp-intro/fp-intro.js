var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    utilities: require('/lib/utilities')
};

// Handle GET request
exports.get = handleGet;

function handleGet(req) {
    var component = libs.portal.getComponent();
    var view = resolve('fp-intro.html');
    var model = createModel();

    function createModel() {
        var model = {};

        model.heading = component.config.heading;
        model.preface = component.config.preface;
        model.button = getButtonData();

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

    return {
        body: libs.thymeleaf.render(view, model)
    };
}