#! node

function isDefined(x) { return x !== null && x !== undefined }
const program = require('commander')
const version = require('../package.json')

program
    .version(version)
    // .