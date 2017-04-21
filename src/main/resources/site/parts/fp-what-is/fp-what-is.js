var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf')
};

// Handle GET request
exports.get = handleGet;

function handleGet(req) {
    var component = libs.portal.getComponent();
    var view = resolve('fp-what-is.html');
    var model = createModel();

    function createModel() {
        var model = {};

        model.heading = component.config.heading;
        model.preface = libs.portal.processHtml({
            value: component.config.preface
        });
        model.testimonialText = component.config.testimonialText;
        model.testimonialName = component.config.testimonialName;
        model.benefits = libs.portal.processHtml({
            value: component.config.benefits
        });

        return model;
    }

    return {
        body: libs.thymeleaf.render(view, model)
    };
}