module.exports = eleventyConfig => {
    eleventyConfig.addWatchTarget("./src/scss");
    eleventyConfig.addPassthroughCopy({ "./vocabustudy/src/icons": "icons" });
    return {
        dir: {
            input: "_src/views",
            output: "_site",
            layouts: "../_layouts"
        },
        templateFormats: ["html", "pug"]
    }
}