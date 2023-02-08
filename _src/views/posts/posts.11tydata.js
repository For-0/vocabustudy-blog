const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = {
    layout: "post.pug",
    tags: ["post"],
    date: process.env.NODE_ENV === "production" ? "git Created" : "Created",
    eleventyComputed: {
        authorData: data =>  {
            let headers = {Accept: "application/vnd.github+json"};
            if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
            return EleventyFetch(`https://api.github.com/users/${data.author}`, { duration: "1d", type: "json", verbose: true, fetchOptions: { headers } });
        }
    }
};