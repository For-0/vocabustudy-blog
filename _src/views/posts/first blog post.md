---
title: First Blog Post!
author: IMGROOT2
tags:
    - coauthored
    - instructions
---
# Hello, World!

This is my first blog post! I'm excited to be writing this post, and I hope you enjoy reading it!
```yaml
---
title: "First Blog Post!"
description: "a test that has been heavily modified by grimsteel just to get stuff working"
author: "IMGROOT2"
tags:
    - what
    - ever
    - tags
    - you
    - want
---
```

This is what the top of your .md file should look like. 

### URLS and slugs

This post will be served at /posts/first-blog-post/. What if you make a new blog post with the name "FirST blog post!!"? It will get the same URL, and Eleventy will throw an error. In this case, add
```yaml
post_slug: "first-blog-post-2"
```
to the front matter