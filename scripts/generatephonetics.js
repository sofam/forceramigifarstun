var wahlin = require('node-wahlin')
const fs = require('fs')

var verbStr = fs.readFileSync('../verb', { encoding: 'UTF-8' })
var nounStr = fs.readFileSync('../substantiv', { encoding: 'UTF-8' })

var verb = verbStr.split('\n')
var noun = nounStr.split('\n')

noun.forEach((val) => {
  var phonetic = wahlin.encode(val)
  console.log("Word: " + val + " Phonetic: " + phonetic)
})