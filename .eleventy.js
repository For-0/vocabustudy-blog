const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = eleventyConfig => {
    eleventyConfig.addWatchTarget("./src/scss");
    eleventyConfig.addPassthroughCopy({ "./vocabustudy/src/icons": "icons" });
    eleventyConfig.addJavaScriptFunction("postDate", value => `<small class="is-pulled-right"><time datetime="${value.toISOString()}">${value.toLocaleString([], {year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit'})}</time></small>`);
    eleventyConfig.addJavaScriptFunction("contentSnippet", value => value.replace(/<[^>]*>/g, "").substring(0, 150));
    eleventyConfig.addJavaScriptFunction("authorPFP", value => `<figure class="media-left"><a href="https://github.com/${value.login}"><p class="image is-48x48"><img class="is-rounded" src="${value.avatar_url}"/></p></a></figure>`);
    global.filters = eleventyConfig.javascriptFunctions;
    eleventyConfig.setPugOptions({
        globals: ["filters"]
    });
    eleventyConfig.addPlugin(syntaxHighlight, {
        templateformats: ["md"]
    });
    return {
        dir: {
            input: "_src/views",
            output: "_site",
            layouts: "../_layouts"
        },
        templateFormats: ["html", "pug", "md"]
    }
}