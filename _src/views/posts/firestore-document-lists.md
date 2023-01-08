---
title: Firestore - Dealing with Lists of Documents
author: grimsteel
tags:
    - programming
    - firestore
    - rest api
    - vocabustudy
---

# The Problem

Vocabustudy has a feature called custom collections. Users can supply Set IDs that are in the collection. The question arises: How do you fetch all of those sets in one network request?

This is how it currently works in `custom-collections.js` with the Firestore Lite JavaScript SDK:

```javascript
import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore/lite";
let customCollection = await getDoc(doc(db, "collections", collectionId));
let collectionData = customCollection.data(); // the property `sets` contains a list of document IDs
let sets = await getDocs(query(collection(db, "meta_sets"), where(documentId(), "in", collectionData.sets)));
```

> Tip: `documentId()` is a special key for querying on the, well, document ID

You might already be able to see some problems with this. Firestore has a (really annoying) limit for `in`, `array-contains`, etc. where you can only supply up to 10 items to search in. __How am I supposed to allow users to put _more_ than 10 sets in a collection?__

> Side note: Vocabustudy already implements pagination in groups of 10, so I _could_ have just supplied a list of 10 IDs at a time. However, this wouldn't work if the pagination groups are larger then 10. Read on!

# The Solution

Use the REST API directly instead! Under the hood, the SDKs just make calls to it. I've actually found many occasions where the REST API has _more_ features than the SDK, including this example and document creation date/times.

While poking through the docs, I found the [perfect method](https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/batchGet). It's called `batchGet`.

This is how I would use it:
```javascript
let sets = await fetch("https://firestore.googleapis.com/v1/projects/PROJECT_ID/databases/(default)/documents:batchGet", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        documents: collectionData.sets.map(setId => `projects/PROJECT_ID/databases/(default)/documents/meta_sets/${setId}`)
    })
});
```

What's interesting is that rather than specifying a list of collection and document IDs, you specify the full path, including the project and database ID. **The docs state that you have to fetch documents from the database specified request URL, but fetching across databases might be a future feature!**

However, this does mean you can fetch documents across collections, in one request! That itself it a big benefit over my original solution.