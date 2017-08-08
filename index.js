const fs = require('fs')

var verbStr = fs.readFileSync('./verb', { encoding: 'UTF-8' })
var nounStr = fs.readFileSync('./substantiv', { encoding: 'UTF-8' })

var verb = verbStr.split('\n')
var noun = nounStr.split('\n')

var randomVerb = function (verb) {
  var index = Math.floor(Math.random() * (verb.length))
  return verb[index]
}

var randomNoun = function (noun) {
  var index = Math.floor(Math.random() * (noun.length))
  return noun[index]
}

var randomNounStartingWithLetter = function (noun, letter) {
  var filteredList = noun.filter(function (val) {
    if (val[0] === letter) {
      return true
    }
  })
  return filteredList
}




for (var i = 0; i < 20; i++) {
  var outputVerb = randomVerb(verb)
  var filteredNounList = randomNounStartingWithLetter(noun, outputVerb[0])
  var outputNoun = randomNoun(filteredNounList)
  console.log(outputVerb + " mig i " + outputNoun)
}