let axios = require("axios").default
let fs = require("fs")

const idRequestData = {
    top: {
        url: "https://hacker-news.firebaseio.com/v0/topstories.json",
        filename: "topNewsMock",
        max: 500
    },
    new: {
        url: "https://hacker-news.firebaseio.com/v0/newstories.json",
        filename: "newestNewsMock",
        max: 500
    },
    job: {
        url:"https://hacker-news.firebaseio.com/v0/jobstories.json",
        filename: "jobNewsMock",
        max: 200
    },
    ask: {
        url: "https://hacker-news.firebaseio.com/v0/askstories.json",
        filename: "askNewsMock",
        max: 200
    },
    show: {
        url: "https://hacker-news.firebaseio.com/v0/showstories.json",
        filename: "showNewsMock",
        max: 200
    }
}

const storyRequestUrl = (storyId) => `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`

let maxForSingleRequest = 50
let LowerBoundarieFor = (page) => page * maxForSingleRequest 
let higherBoundarieFor = (page) => (page * maxForSingleRequest + maxForSingleRequest)

async function generateMock(info, isInsideBoundarieCalculation, page) {
    
    try {
        const ids = (await axios.get(info.url)).data
        console.log(ids)
        Promise.all(
            ids
                .filter((v, i) => isInsideBoundarieCalculation(i))
                .map(id => axios.get(storyRequestUrl(id)))
            ).then(res => 
                    generateJSON(res.map(item => item.data), info.filename, page)
                ).catch(e => console.log(e))
    } catch (error) {
        console.log(error)
    }
    
}

function generateJSON(data, filename, page) {
    const feed = data
    .filter(v => v !== null)
    .map(v => {
        return {
            storyIdentifier: v.id ? v.id : 666,
            title: `${v.title}`,
            subtitle: `${v.score} by ${v.by}`,
            url: v.url ? v.url : `https://news.ycombinator.com/item?id=${v.id}`
        }   
})

    const mock = JSON.stringify({
        page: 0,
        quantity: feed.length,
        data: feed
    })
    
    fs.writeFile(`${filename}/${filename}forPage${page}.json`, mock, function (err) {
        if (err) {
            console.log(`Failed to Generate JSON file because: \n ${err}`)
        }

        console.log('FileGenerated')
    })
}

function isUnderRequestLimit(actual, limit) {
    return actual <= limit
}

async function generateAllPagesForMock(info) {
    let page = 0
    
    while (isUnderRequestLimit(higherBoundarieFor(page), info.max)) {
        await generateMock(info, (index) => (index >= LowerBoundarieFor(page)) && (index < higherBoundarieFor(page)), page)
        page += 1
    }
}

async function main() {
    await generateAllPagesForMock(idRequestData.top)
    await generateAllPagesForMock(idRequestData.new)
    await generateAllPagesForMock(idRequestData.job)
    await generateAllPagesForMock(idRequestData.ask)
    await generateAllPagesForMock(idRequestData.show)
}

main()
