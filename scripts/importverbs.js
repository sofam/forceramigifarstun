var request = require('request')
var cheerio = require('cheerio')

var wiktionaryApiUrl = 'https://sv.wiktionary.org/w/api.php'
// ?action=query&list=categorymembers&
//cmtitle=Kategori:Svenska/Verb&format=json&cmlimit=500'

var getVerb = function (page) {
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

    var findVerb = $("th:contains('Imperativ')")
      .siblings('td')
      .find('a[class="mw-selflink selflink"]').text()

    if (findVerb == "") return


    console.log("Found imperative verb: " + findVerb)
    saveVerb(findVerb)
  })
}

var saveVerb = function (verb) {

}

var getNextPage = function (continuetoken) {

}

var getVerbs = function (continuetoken) {
  if (!continuetoken) {
    var continuetoken = ''
  }
  request({
    uri: wiktionaryApiUrl,
    qs: {
      action: 'query',
      list: 'categorymembers',
      cmtitle: 'Kategori:Svenska/Verb',
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

    returnObject.query.categorymembers.forEach(function (val) {
      setTimeout(getVerb,500,val)
    })
    if(cmcontinue != '') {
      setTimeout(getVerbs, 5000, cmcontinue )
      
    }
  })
}

getVerbs()