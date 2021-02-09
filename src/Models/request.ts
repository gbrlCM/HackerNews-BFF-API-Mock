export interface StoryType {
    url: string,
    filename: string,
    max: number
}

const topStory: StoryType = {
    url: "https://hacker-news.firebaseio.com/v0/topstories.json",
    filename: "topNewsMock",
    max: 500
}

const newStory: StoryType = {
    url: "https://hacker-news.firebaseio.com/v0/newstories.json",
    filename: "newestNewsMock",
    max: 500
}

const jobStory: StoryType = {
    url:"https://hacker-news.firebaseio.com/v0/jobstories.json",
    filename: "jobNewsMock",
    max: 200
}

export const requestCollection: StoryType[] = [
    topStory,
    newStory,
    jobStory
]

export const itemUrlForId = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`

