---
title: Decoding the Firebase Remote Config REST API
author: grimsteel
tags:
    - programming
    - remote config
    - rest api
    - optimization
---

As you may know, I like using Firebase's REST API directly over the official SDKs as this greatly reduces bundle sizes. However, the Remote Config REST API has no official documentation.

> The Firebase docs include documentation for the "admin" api, for _configuring_ Remote Config, but the client API remains undocumented.

The REST API can actually be broken up into two parts - Installations and the actual Remote Config

Before we begin, you'll need a couple pieces of information:
1. App level web API key
2. Project ID
3. App ID
4. Installations SDK Version (`w:0.5.16`)
5. Installations Auth Version (`FIS_v2`)

You can get #1, #2, and #3 from the config object Firebase gives you in the console. You can get #4 and #5 by inspecting the network requests your app makes. I put their values above as of the time of writing.

## Part 1 - Installations
You may have noticed that the Remote Config dashboard tells you how many users have fetched in the last 24 hours. I think Firebase tracks users based on installations.

Every installation has its own unique FID. (Firebase Installation ID) This is a 22 base64 character string, so we make a Uint8Array of 17 bytes.

> 1 character in base64 is 6 in base 2 because 64 = 2<sup>6</sup>
> 
> 22 characters in base64 is 132 in base 2
> 
> 132 bits = 16.5 bytes. We round up to 17

_[**Reference:** Official JS SDK Code](https://github.com/firebase/firebase-js-sdk/blob/f5a17143b1930b7b7b45d431ad21f50b236e4f80/packages/installations/src/helpers/generate-fid.ts)_

```javascript
function generateFid() {
  // An Firebabase Installation ID is a 22 base64 character string. (16.5 bytes rounded up to 17)
  const byteArr = new Uint8Array(17);
  crypto.getRandomValues(byteArr);
  // Replace the first four bits with 0111 for the constant FID header
  byteArr[0] = 0b01110000 + (byteArr[0] % 0b00010000);
  return encode(byteArr);
}

/** Convert a FID Uint8Array into a base64 string */
function encode(arr: Uint8Array) {
  const b64 = window.btoa(String.fromCharCode(...arr));
  const urlSafe = b64.replace(/\+/g, "-").replace(/\//g, "_");
  // Removes the 23rd character because FIDs are 22 characters long
  return urlSafe.substring(0, 22);
}
```
Once you've got your FID, make a POST request to your installations endpoint:
```javascript
await fetch(https://firebaseinstallations.googleapis.com/v1/projects/PROJECT_ID/installations, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": "WEB_API_KEY"
  },
  body: JSON.stringify({
    fid: "FID",
    sdkVersion: "INSTALLATIONS_SDK_VERSION",
    appId: "APP_ID",
    authVersion: "INSTALLATIONS_AUTH_VERSION"
  })
});
```
If everything went well, the response should look like this:
```json
{
  "refreshToken": "REFRESH_TOKEN",
  "authToken": {
    "token": "AUTH_TOKEN",
    "expiresIn": "EXPIRES_IN (provided in seconds)"
  }
}
```
Store this data somewhere. (I used IndexedDB)

Eventually, the auth token will expire. (As of the time of writing, this is after one week)

To refresh it:
```javascript
await fetch(`https://firebaseinstallations.googleapis.com/v1/projects/PROJECT_ID/FID/authTokens:generate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": "WEB_API_KEY",
    Authorization: `INSTALLATIONS_AUTH_VERSION(space)REFRESH_TOKEN`
  },
  body: JSON.stringify({ installation: { sdkVersion: "INSTALLATIONS_SDK_VERSION", appId: "APP_ID" } })
});
```
The response is as follows:
```json
{
  "token": "AUTH_TOKEN",
  "expiresIn": "EXPIRES_IN (provided in seconds)"
}
```

For some reason, `expiresIn` has an "s" after it. (This probably means "seconds")

## Part 2 - Remote Config

Now that you've got your FID and auth token, it's time to fetch the config!
```javascript
await fetch(`https://firebaseremoteconfig.googleapis.com/v1/projects/PROJECT_ID/namespaces/firebase:fetch?key=WEB_API_KEY`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    app_instance_id: "FID",
    app_id: "APP_ID",
    app_instance_id_token: "INSTALLATIONS_AUTH_TOKEN",
    language_code: getLanguage(),
    sdk_version: "9.14.0" // This is the JavaScript SDK version at the time of writing
  })
});

function getLanguage() {
  return (navigator.languages && navigator.languages[0]) || navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || "en-US";
}
```

I would recommend caching this somewhere so you don't hit your fetch limits.

I hope this article helps someone
