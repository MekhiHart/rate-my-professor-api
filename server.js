const fs = require("fs")
// const { scrollPageToBottom } = require('puppeteer-autoscroll-down')
const isElementVisible = async (page, cssSelector) => { // * checks first if the button exists
    let visible = true;
    await page
      .waitForSelector(cssSelector, { visible: true, timeout: 2500 })
      .catch(() => {
        visible = false;
      });
    return visible;
  };

async function startDemo(pageInstance){
    console.log("Started query operation")
    const puppeteer = require("puppeteer")
    const browser = await puppeteer.launch()

    const page = await browser.newPage()
    
    const csulb_url = "https://www.ratemyprofessors.com/search/teachers?query=*&sid=162"
    const test_url = "https://www.ratemyprofessors.com/search/teachers?query=*&sid=33"

    const cookiePolicyButton_Selector = "div > button[class*=CCPAModal__StyledCloseButton-sc-10x9kq-2]"
    const showMoreButton_Selector = "div > button[class*=PaginationButton__StyledPaginationButton-txi1dr-1"

    await page.goto(csulb_url)

    await page.click(cookiePolicyButton_Selector)

    const nameQuery = "div > div[class*=CardName__StyledCardName-sc-1gyrgim-0]" // ! works
    const qualityQuery = "div > div[class*=CardNumRating__CardNumRatingNumber-sc-17t4b9u-2]" // ! works

    // *retake is the first element of the pair and difficulty is the second element of the pair
    const retake_and_difficulty_Query = "div[class*=CardFeedback__StyledCardFeedback-lq6nix-0] div > div" // !retake and difficulty is adjacent each other, this query includes both retake and difficulty information

    const namesArray = await page.evaluate( (targetQuery) =>{ // * professor quality
      return Array.from(document.querySelectorAll(targetQuery)).map(child => child.textContent)
    },nameQuery)

    const qualityArray = await page.evaluate( (targetQuery) =>{ // * professor quality
        return Array.from(document.querySelectorAll(targetQuery)).map(child => child.textContent)
      },qualityQuery)

    const difficulty_and_retake_Array = await page.evaluate( (targetQuery) =>{ // * test
      return Array.from(document.querySelectorAll(targetQuery)).map(child => child.textContent)
      },retake_and_difficulty_Query)
  
    let data = "Name,Quality,RetakePercent,Difficulty\n"
    let gapAdd_retake = 0
    let gapAdd_difficulty = 1

    let currentName, currentQuality, currentRetake, currentDifficulty

    const arrayLength = namesArray.length
    for (let i=0; i<arrayLength; i++){
      currentName = namesArray[i]
      currentQuality = qualityArray[i]
      currentRetake = difficulty_and_retake_Array[i + gapAdd_retake]
      currentDifficulty = difficulty_and_retake_Array[i +gapAdd_difficulty ]
      
      data += `${currentName},${currentQuality},${currentRetake},${currentDifficulty}\n`

      gapAdd_retake++
      gapAdd_difficulty++
    }
    fs.writeFile("./professors.csv", data, () =>{
      console.log("File Written")
    })

    // browser.close()
}


async function queryProfessors(pageInstance){

  console.log("Query Professors Func started")
  const nameQuery = "div > div[class*=CardName__StyledCardName-sc-1gyrgim-0]" // ! works
  const qualityQuery = "div > div[class*=CardNumRating__CardNumRatingNumber-sc-17t4b9u-2]" // ! works

  // *retake is the first element of the pair and difficulty is the second element of the pair
  const retake_and_difficulty_Query = "div[class*=CardFeedback__StyledCardFeedback-lq6nix-0] div > div" // !retake and difficulty is adjacent each other, this query includes both retake and difficulty information

  const namesArray = await pageInstance.evaluate( (targetQuery) =>{ // * professor quality
    return Array.from(document.querySelectorAll(targetQuery)).map(child => child.textContent)
  },nameQuery)

  console.log("Queried Names")

  const qualityArray = await pageInstance.evaluate( (targetQuery) =>{ // * professor quality
      return Array.from(document.querySelectorAll(targetQuery)).map(child => child.textContent)
    },qualityQuery)

    console.log("Queried Quality")


  const difficulty_and_retake_Array = await pageInstance.evaluate( (targetQuery) =>{ // * test
    return Array.from(document.querySelectorAll(targetQuery)).map(child => child.textContent)
    },retake_and_difficulty_Query)

  console.log("Queried Diff & Retake")

  let data = "Name,Quality,RetakePercent,Difficulty\n"
  let gapAdd_retake = 0
  let gapAdd_difficulty = 1

  let currentName, currentQuality, currentRetake, currentDifficulty

  const arrayLength = namesArray.length
  for (let i=0; i<arrayLength; i++){
    currentName = namesArray[i]
    currentQuality = qualityArray[i]
    currentRetake = difficulty_and_retake_Array[i + gapAdd_retake]
    currentDifficulty = difficulty_and_retake_Array[i +gapAdd_difficulty ]
    
    data += `${currentName},${currentQuality},${currentRetake},${currentDifficulty}\n`

    gapAdd_retake++
    gapAdd_difficulty++
  }
  fs.writeFile("./professors.csv", data, () =>{
    console.log("File Written")
  })

  console.log("Writing file")
  // browser.close() // closes browswer
  // console.log("browser closed")

}

async function pressButton(){
  console.log("Started operation")
  const wsChromeEndpointurl = "ws://127.0.0.1:9222/devtools/browser/dcc44cb1-fdfa-4610-b541-00e37a663679"
  const puppeteer = require("puppeteer")
  // const browser = await puppeteer.launch()
  // const page = (await browser).newPage()
  console.log("Connecting...")
  const browser = await puppeteer.connect({browserWSEndpoint:wsChromeEndpointurl}) // * for connecting 
  console.log("Connected!")
  const pages = await browser.pages()
  console.log("Pages in Browser: ",pages)

  const page = pages[pages.length - 1]
  console.log("Target Page: ",page)



  // const page = await browser.pages()[0] // * for a browswer with an existing page

  // console.log("Current Page: ",page)
  // console.log("Browser pages:", page)
  
  const csulb_url = "https://www.ratemyprofessors.com/search/teachers?query=*&sid=162"
  const test_url = "https://www.ratemyprofessors.com/search/teachers?query=*&sid=33"

  const cookiePolicyButton_Selector = "div > button[class*=CCPAModal__StyledCloseButton-sc-10x9kq-2]"
  const showMoreButton_Selector = "div > button[class*=PaginationButton__StyledPaginationButton-txi1dr-1]"

  // await page.goto(csulb_url) // * if existing page is not on target web

  // await page.click(cookiePolicyButton_Selector)

  let buttonShowVisible = await isElementVisible(page,showMoreButton_Selector)
  let buttonCount = 0

  console.log("Button exists: ",buttonShowVisible)

  queryProfessors(page)

  // const interval = setInterval( async () =>{
  //   buttonShowVisible = await isElementVisible(page,showMoreButton_Selector)
  //   // console.log("Button visibility: ",buttonVisible)

  //   if (buttonShowVisible){ // Keeps clicking button until it does not exist
  //     console.log("Button count: ", buttonCount++)
  //     await page.click(showMoreButton_Selector)

  //   }
  //   else{ // *once all show buttons are clicked
  //     clearInterval(interval)
  //     // clearInterval(screenshotInterval)
  //     console.log("Run query")

  //     // await page.screenshot({path:"screenshot.png"}) 
  //     // await queryProfessors(page,browser) // * browser is closed inside this functipn

  //     console.log("Query Successful")
  //   }
  // }, 800)

}

function testData(){
  const namesArray = []

  const qualityArray = []

  const difficulty_and_retake_Array = []


  for (let i=0;i<6000;i++){
    namesArray.push("Ali Sharifian")
    qualityArray.push("10")
  }

  for (let i=0; i<6000; i++){
    difficulty_and_retake_Array.push("difficulty")
    difficulty_and_retake_Array.push("retake")
  }


  let data = "Name,Quality,RetakePercent,Difficulty\n"
  let gapAdd_retake = 0
  let gapAdd_difficulty = 1

  let currentName, currentQuality, currentRetake, currentDifficulty

  const arrayLength = namesArray.length
  for (let i=0; i<arrayLength; i++){
    currentName = namesArray[i]
    currentQuality = qualityArray[i]
    currentRetake = difficulty_and_retake_Array[i + gapAdd_retake]
    currentDifficulty = difficulty_and_retake_Array[i +gapAdd_difficulty ]
    
    data += `${currentName},${currentQuality},${currentRetake},${currentDifficulty}\n`

    gapAdd_retake++
    gapAdd_difficulty++
  }

  fs.writeFile("TEST.csv", data, ()=>{
    console.log("Done writing")
  })


}


// testData()

// start()

pressButton()

