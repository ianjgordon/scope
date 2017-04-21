var libs = {
    portal: require('/lib/xp/portal'),
    content: require('/lib/xp/content')
};

/**
 * Returns URL for a selected page, unless a hardcoded external URL is passed. Returns default URL if no page or link. Used on all parts
 * with page picker for a link.
 * @param {Content} content key of the selected landing page, if one was selected. config['linkPage']
 * @param {String} Hardcoded URL for external link. Overrides the page.
 * @return {String} Returns the URL
 */
exports.getLinkUrl = function(contentKey, url) {
    var returnUrl = null;

    if (url) {
        returnUrl = url;
    }
    else if (contentKey) {
        returnUrl = libs.portal.pageUrl({
            id: contentKey
        });
    }
    return returnUrl;
};