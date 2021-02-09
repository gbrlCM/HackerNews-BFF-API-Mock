"use strict";
exports.__esModule = true;
exports.itemUrlForId = exports.requestCollection = void 0;
var topStory = {
    url: "https://hacker-news.firebaseio.com/v0/topstories.json",
    filename: "topNewsMock",
    max: 500
};
var newStory = {
    url: "https://hacker-news.firebaseio.com/v0/newstories.json",
    filename: "newestNewsMock",
    max: 500
};
var jobStory = {
    url: "https://hacker-news.firebaseio.com/v0/jobstories.json",
    filename: "jobNewsMock",
    max: 200
};
exports.requestCollection = {
    top: topStory,
    "new": newStory,
    job: jobStory
};
var itemUrlForId = function (id) { return "https://hacker-news.firebaseio.com/v0/item/" + id + ".json"; };
exports.itemUrlForId = itemUrlForId;
