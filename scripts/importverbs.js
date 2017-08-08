var request = require('request')
var cheerio = require('cheerio')

var wiktionaryApiUrl = 'https://sv.wiktionary.org/w/api.php'
// ?action=query&list=categorymembers&
//cmtitle=Kategori:Svenska/Verb&format=json&cmlimit=500'

var getVerb = function(page) {
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
    $ = cheerio.load(body.parse)
    var findVerb = $('table[class="grammar template-sv-verb-ar"]')
    .find("th:contains('Imperativ')")
    .find('a[class="mw-selflink selflink"')
    console.log(findVerb)
  })
}

var saveVerb = function(verb) {

}

var getNextPage = function(continuetoken) {

}

request({
  uri: wiktionaryApiUrl,
  qs: {
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Kategori:Svenska/Verb',
    format: 'json',
    cmlimit: 10
    }}, function(error, response, body) {
  var cmcontinue = ''
  if(error) {
    console.log(error)
    return
  }
  console.log('Got statuscode ' + response.statusCode)
  var returnObject = JSON.parse(body)
  if(returnObject.continue) {
    if(returnObject.continue.cmcontinue) {
      cmcontinue = returnObject.continue.cmcontinue
      console.log('Got cmcontinue token: ' + cmcontinue)
    }
  }
  
  returnObject.query.categorymembers.forEach(function (val) {
    getVerb(val)
  })

})