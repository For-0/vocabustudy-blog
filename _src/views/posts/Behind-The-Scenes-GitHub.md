---
title: Behind The Scenes - GitHub
author: IMGROOT2
tags:
    - behind the scenes
    - for zero
    - developing
---

I've decided to start a blog series, which I have aptly chosen to name Behind For Zero. In this blog series, I'll share some special applications, tricks, and tips we developers use here at For Zero.

###### **Quick reminder:** Remember to check in on Undefined now and then to read the latest blog post! We post at a minimum every few days so that you can get fresh new content quickly.

Alright, today I'll start with one of the essential tools we use daily: GitHub!

## **What is GitHub?** 

GitHub is an Internet hosting service for software development and version control using Git. Git is a version control system handled using commands in the terminal. GitHub is like Google Drive but for your code. GitHub also has many helpful features like posting problems publicly for developers to fix (Issues), providing excellent documentation (Wikis), and good code security.

## **Okay, how does GitHub work?** 

GitHub duplicates the cloud version of your code onto your computer, where you'll make edits to the code. Then, when you want to update the cloud version with your edits, you'll need to take advantage of the core features of GitHub:

-   **Commit:** This is taking a snapshot of your code and storing the edits in your computer, ready to ship off to update the cloud version.
-   **Push:** Pushing your code means sending your Commits to GitHub, where they will be either added to the main branch or another branch of your choosing.

Wait, hang on. What are branches?

**Branches** are different paths your main code is being developed. Let's say that two people want to implement a feature. Person A would develop it on their branch, supposedly named "PersonA." Person B, however, would develop it on another branch because they implement the feature differently. GitHub's branches feature allows many people to code a difference in their own way without affecting the main branch.

**The main branch?** The main branch is the branch that is considered to be the main code. This is the branch containing the code that the public will see or the latest officially released version of your web app, mobile app, website, or other product. A good practice for dealing with making good edits to the main branch is working through Pull Requests.

**What's a Pull Request?** A Pull Request (also known as a PR) marks a branch to be combined back into the main branch with the new edits. Person A coded a feature that everybody on the developer team believes should be added to the latest release. Then, Person A will create a Pull Request to signify that they want to add their new changes in their "PersonA" branch. If the reviewers of the Pull Request approve the code, then the main branch will be updated with the recent changes in "PersonA," and since the changes are in the main version, the "PersonA" branch can be deleted.

That is a lot! However, this only illustrates how important GitHub is when creating and editing code. GitHub helps to maintain a universally well-coded project that combines the best of all the coders involved.

Got any questions? Feel free to ask in Discord. See you soon!
