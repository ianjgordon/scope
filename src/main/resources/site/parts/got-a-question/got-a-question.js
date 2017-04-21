var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf')
};

// Handle GET request
exports.get = handleGet;

function handleGet(req) {
    var component = libs.portal.getComponent();
    var view = resolve('got-a-question.html');
    var model = createModel();

    function createModel() {
        var model = {};

        model.heading = component.config.heading;
        model.text = libs.portal.processHtml({
            value: component.config.text
        });

        return model;
    }

    return {
        body: libs.thymeleaf.render(view, model)
    };
}