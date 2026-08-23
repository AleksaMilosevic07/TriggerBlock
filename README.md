# TriggerBlock
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A browser extension that hides media content which triggers specific phobias. Made for CS50 final project.
## How does it work?
It checks image alt text as well as titles, headers and paragraphs inside the article the image was found in. If any of the text contains words that may trigger a reaction in certain phobias, it will be blurred, with a button to reveal it in case it's a false positive. Every phobia also includes a SAFE WORD list, to help filter out false positives as much as possible (for example spiderman won't be flagged under arachnophobia, python development won't be considered ophidiophobia, etc). TriggerBlock will not blur or hide text, it will specifically target images to avoid visual response. This approach catches most, but not all, triggering content.
## Planned features
1. Video blocking
   
   Framework for detecting videos is already in place, but every website serves videos differently and it requires much more fine-tuning on a per-site basis. Work on this feature is in progress.
2. Severe filter
   
   A more severe filter that will blur any image/video FIRST, then ask questions later. Anything that gives off any sign of potential sensitive content will be blurred, ignoring safe words completely.
3. Custom filter
   
   Anyone can add their own ruleset of which words will trigger the filter
4. Chrome support
   
   I don't use Chrome, and I'd have to pay a fee to submit my extension there as well as change some code to support their browser. It will come eventually.
## How to make TriggerBlock better?
TriggerBlock is not perfect, but with your help we can make it better.
Anyone willing to contribute is much appreciated and welcome, and you don't need to know how to code!
You can help by reporting content that should have been flagged but wasn't, expanding our lists of trigger words and safe words, or suggesting entirely new phobias to support.

## Installation
*(coming soon - extension is awaiting store publication)*
