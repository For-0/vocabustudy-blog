---
title: Firestore - Working with Field Masks
author: grimsteel
tags:
    - programming
    - firestore
    - rest api
    - vocabustudy
    - optimization
---

Sets in Vocabustudy are split over two collections in Firestore - the actual set content and the metadata of the set. However, there are a couple fields that are duplicated across both collections.

| collection | field | description|
| --- | --- | --- |
| both | uid | user ID |
| both | name | set name |
| both | visibility | visibility of the set |
| meta_set | creator | the creator's display name |
| meta_set | collections | basically tags |
| meta_set | likes | the like count (updated by a script) |
| meta_set | numTerms | the number of terms (without this field I would have to fetch `terms` to get the length) |
| meta_set | nameWords | a list of words in the set name (for "searching") |
| set | description | an extended description |
| set | terms | the actual vocabulary in the set |

Now, why did I do this? Why can't I have all of the fields in one collection? When users are searching for sets or viewing the sets, _all_ of the information for each document is loaded. the `terms` field can be significantly large for certain sets, and loading that for each document returned would take significantly longer than simply loading the metadata needed to show a simple link to a set.

This is costly to maintain, as it requires _two_ writes to create, edit, or delete a set and, of course, duplicate data has to be written.

However, the Firestore REST API has once again proved to be very useful!

The [documentation for the `documents.get` method](https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/get) (and a lot of the other methods!) describes a `mask` query parameter.

That means I can only retrieve certain fields -- thereby decreasing the data egress -- while still storing everything in one document!

For instance, if I wanted to only get the metadata for a set, I could do this:

```javascript
const setRes = await fetch("https://firestore.googleapis.com/v1/projects/PROJECT_ID/databases/(default)/documents/sets/SET_ID?mask=uid,name,creator,collections,likes,numTerms");
const { fields: setFields } = await setRes.json();
```

> **Why isn't this in in the Web SDK?** The folks at Firebase actually do have a good reason for this - the Mobile and Web SDKs are designed to be mobile first. If only _part_ of a document was retrieved, the user would face only having that partial document when offline. Even so, that doesn't stop use from using the REST API!

Hopefully this post will help someone out there...