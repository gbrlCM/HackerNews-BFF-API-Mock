import axios from 'axios'
import fs from 'fs'
import { requestCollection, itemUrlForId, StoryType } from './Models/request'
import { HackerNewsAPIOutput, FormatedStory, Feed } from './Models/apiModels'
import { constants } from './Constants/Constants'

async function generateMock(storyType: StoryType) {
    const ids: number[] = await idsForStoryType(storyType)
    const unformatedStories: HackerNewsAPIOutput[] = await storyForIds(ids)
    const formatedStories: FormatedStory[] = formatStories(unformatedStories)
    const feeds = createAllFeeds(formatedStories, ids)
    writeJSON(feeds, storyType.filename)
}

async function idsForStoryType(storyType: StoryType): Promise<number[]> {
    let ids = (await axios.get(storyType.url)).data
    return ids
}

async function storyForIds(ids: number[]): Promise<HackerNewsAPIOutput[]> {
    let stories: HackerNewsAPIOutput[] = await Promise.all(
        ids.map( async id => await requestAStory(id))
    )
    return stories
}

async function requestAStory(id:number): Promise<HackerNewsAPIOutput> {
    let data:HackerNewsAPIOutput = (await axios.get(itemUrlForId(id))).data
    return data
}

function formatStories(stories: HackerNewsAPIOutput[]): FormatedStory[] {
    return stories.filter(v => v !== null).map((story: HackerNewsAPIOutput): FormatedStory => {
        let data: FormatedStory = {
            id: story.id,
            title: story.title,
            subtitle: `${story.score} points by ${story.by} 10m ago`,
            url: story.url ? story.url : `https://news.ycombinator.com/item?id=${story.id}`
        }
        return data 
    })
}

function createFeed(page: number, ids: number[], stories: FormatedStory[]): Feed {
    return {
        page,
        ids,
        quantity: stories.length,
        data: stories
    }
}

function createAllFeeds(stories: FormatedStory[], ids: number[]): Feed[] {
    let slicedStories = sliceStories(stories)
    return slicedStories.map((stories, page) => createFeed(page, ids, stories))

}

function sliceStories(stories: FormatedStory[]): FormatedStory[][] {
    let arrayOfArray: FormatedStory[][] = []

    let i = Math.round(stories.length / constants.maxItemsForSingleRequest)

    if (i > 0) {
        for (let j = 0; j < i; j++) {
            let start = constants.maxItemsForSingleRequest * j
            let finish = constants.maxItemsForSingleRequest + start
            arrayOfArray.push(stories.slice(start, finish))        
        }
    } else {
        arrayOfArray.push(stories)
    }
    return arrayOfArray
}

function writeJSON(feeds:Feed[], filename: string) {
    fs.writeFile(`./${filename}.json`, JSON.stringify(feeds), function (err:any) {
        if (err) {
            console.log(`Failed to Generate JSON file because: \n ${err}`)
        }

        console.log('FileGenerated')
    })
}

async function main() {
    requestCollection.forEach(async storyType => await generateMock(storyType))
}

main()
