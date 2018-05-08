'use strict'
const util = require('util')
const winston = require('winston')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const logger = require('./lib/logger')

// Log unhandled promise rejections
process.on('unhandledRejection', (err) => {
  if (!(err instanceof Error)) {
    err = new Error(`Promise rejected with value: ${util.inspect(err)}`)
  }
  logger.error(err.stack)
})

// Prevent the app from crashing on unhandled exceptions
winston.Logger({
  transports: [new winston.transports.Console({handleExceptions: true})],
  exitOnError: false
})

async function main() {
  const app = require('./app')
  const appEnv = {isLocal: true}
  const port = appEnv.isLocal ? 8874 : appEnv.port

  const username = 'admin'
  const password = 'admin'
  const url = "ds019940.mlab.com:19940/sample-api"

  const options = {
    promiseLibrary: global.Promise,
    sslValidate: false
  }

  if (appEnv.isLocal) {
    await mongoose.connect(`mongodb://${username}:${password}@${url}`)
  }

  app.listen(port, () => {
    logger.info(`✓ Server listening on port ${port}`)
  })
}

main()