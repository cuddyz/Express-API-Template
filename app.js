
'use strict'
const express = require('express')
const send = require('send')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

require('./models/sample')

const app = express()

// version
app.get('/version.(json|html)', (req, res, next) => {
  send(req, `version.${req.params[0]}`).pipe(res)
})

app.use(bodyParser.json())

// serve docs from the root without causing 404s to stop working
app.get(/^\/([^/]+\.(html|css|js))?$/, swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const idValid = require('./middleware/id-validator')

const sample = require('./routes/sample')

app.use('/sample', express.Router()
  .get('/', sample.list)
  .get('/:id', idValid, sample.show)
  .post('/', sample.create)
  .put('/:id', idValid, sample.update)
  .delete('/:id', idValid, sample.remove))

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})
// error handler
app.use((err, req, res, next) => {
  let status = err.status || 500
  let message = err.message || 'Internal Server Error'
  res.status(status).json({message: message})
})

module.exports = app