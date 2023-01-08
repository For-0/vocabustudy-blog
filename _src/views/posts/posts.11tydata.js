const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = {
    layout: "post.pug",
    tags: ["post"],
    date: process.env.NODE_ENV === "production" ? "git Last Modified" : "Created",
    eleventyComputed: {
        authorData: data =>  EleventyFetch(`https://api.github.com/users/${data.author}`, { duration: "1d", type: "json", verbose: true })
    }
};