const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const {DateTime} = require("luxon"); // Luxon is an eleventy dependency
const EleventyImage = require("@11ty/eleventy-img");

const imgOptions = {
    urlPath: "/external-images/",
    formats: ["webp"],
    outputDir: "./_site/external-images/",
    widths: [48],
    filenameFormat: (_id, src, width, format) => `${src.match(/u\/(\d+)/)[1]}-${width}.${format}`
};

module.exports = eleventyConfig => {
    eleventyConfig.addWatchTarget("./src/scss");
    eleventyConfig.addPassthroughCopy({ "./_src/images": "images" });
    eleventyConfig.addPassthroughCopy("robots.txt")
    eleventyConfig.addJavaScriptFunction("postDate", value => {
        let date = process.env.NODE_ENV === "production" ? DateTime.fromJSDate(value, {zone: "utc"}).setZone("America/Chicago") : DateTime.fromJSDate(value);
        return `<small class="is-pulled-right">Posted on <time datetime="${date.toISO()}">${date.toLocaleString({year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', })}</time></small>`;
    });
    eleventyConfig.addJavaScriptFunction("contentSnippet", value => value.replace(/<[^>]*>/g, "").substring(0, 150));
    eleventyConfig.addJavaScriptFunction("authorPFP", value => {
        EleventyImage(value.avatar_url, imgOptions);
        let imageHtml = EleventyImage.generateHTML(EleventyImage.statsByDimensionsSync(value.avatar_url, 48, 48, imgOptions), {
            class: "is-rounded",
            alt: "Profile Picture",
            loading: "lazy",
            decoding: "async"
        });
        return `<figure class="media-left"><a href="https://github.com/${value.login}"><p class="image is-48x48">${imageHtml}</p></a></figure>`;
    });
    eleventyConfig.addJavaScriptFunction("getNewestCollectionItemDate", pluginRSS.getNewestCollectionItemDate);
    eleventyConfig.addJavaScriptFunction("dateToRfc3339", pluginRSS.dateToRfc3339);
    eleventyConfig.addJavaScriptFunction("absoluteUrl", pluginRSS.absoluteUrl);
    eleventyConfig.addJavaScriptFunction("htmlToAbsoluteUrls", pluginRSS.convertHtmlToAbsoluteUrls);
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