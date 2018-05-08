const wrap = require('async-middleware').wrap

const mongoose = require('mongoose')
const Sample = mongoose.model('Sample')
const Rest = require('../lib/rest')

class SampleRest extends Rest {
  constructor() {
    super(Sample, true)
  }
}

const rr = new SampleRest()

module.exports = {
  list: wrap(rr.list.bind(rr)),
  show: wrap(rr.show.bind(rr)),
  create: wrap(rr.create.bind(rr)),
  update: wrap(rr.update.bind(rr)),
  remove: wrap(rr.remove.bind(rr))
}