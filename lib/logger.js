'use strict'
const winston = require('winston')

let logger
let isLocal = true

if (isLocal) {
  logger = new(winston.Logger)({
    transports: [new winston.transports.Console({level: 'debug', colorize: true})]
  })
}

module.exports = logger