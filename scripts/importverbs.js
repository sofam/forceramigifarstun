var request = require('request')
var cheerio = require('cheerio')
const fs = require('fs')

var wiktionaryApiUrl = 'https://sv.wiktionary.org/w/api.php'
// ?action=query&list=categorymembers&
//cmtitle=Kategori:Svenska/Verb&format=json&cmlimit=500'

var getVerb = function (page, filename) {
  request({
    uri: wiktionaryApiUrl,
    qs: {
      action: 'parse',
      pageid: page.pageid,
      format: 'json',
      prop: 'text',
      formatversion: 2
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Got error: ' + error)
      return
    }

    var pageObject = JSON.parse(body)

    $ = cheerio.load(pageObject.parse.text)

    var findWord = $("th:contains('Imperativ')")
      .siblings('td')
      .find('a[class="mw-selflink selflink"]').first().text()

    if (findWord == "") return


    console.log("Found imperativ of word: " + findWord)
    saveWord(findWord,filename)
  })
}

var getNoun  = function (page, filename) {
  request({
    uri: wiktionaryApiUrl,
    qs: {
      action: 'parse',
      pageid: page.pageid,
      format: 'json',
      prop: 'text',
      formatversion: 2
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Got error: ' + error)
      return
    }

    var pageObject = JSON.parse(body)

    $ = cheerio.load(pageObject.parse.text)

    var findWord = $("th:contains('Nominativ')")
      .siblings('td')
      .children('span[class="b-"]')
      .find('a').first().text()


    if (findWord == "") return

    console.log("Found nominativ of word: " + findWord)
    saveWord(findWord,filename)
  })
}

var saveWord = function (word, filename) {
  fs.writeFileSync(filename, word + '\n', {flag: 'a'})
}


var getCategory = function (continuetoken, category, filename) {
  if (!continuetoken) {
    var continuetoken = ''
  }
  if (!category) {
    console.error("Need to specify category")
  } 

  request({
    uri: wiktionaryApiUrl,
    qs: {
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      format: 'json',
      cmlimit: 500,
      cmcontinue: continuetoken
    }
  }, function (error, response, body) {
    var cmcontinue = ''
    if (error) {
      console.log(error)
      return
    }
    console.log('Got statuscode ' + response.statusCode)
    var returnObject = JSON.parse(body)
    if (returnObject.continue) {
      if (returnObject.continue.cmcontinue) {
        cmcontinue = returnObject.continue.cmcontinue
        console.log('Got cmcontinue token: ' + cmcontinue)
      }
    }
    if (category == 'Kategori:Svenska/Substantiv') {
      returnObject.query.categorymembers.forEach(function (val) {
        setTimeout(getNoun,5000,val,filename)
      })
    }
    else if (category == 'Kategori:Svenska/Verb') {
      returnObject.query.categorymembers.forEach(function (val) {
        setTimeout(getVerb,5000,val,filename)
      })
    }
    if(cmcontinue != '') {
      setTimeout(getCategory, 15000, cmcontinue, category, filename )
      
    }
  })
}

getCategory('','Kategori:Svenska/Substantiv', 'substantiv')