const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SampleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }
})

const common = require('./common')
SampleSchema.plugin(common.auditFields)

// this makes it so logging outputs includes the virtual ones
SampleSchema.set('toObject', {
  getters: true
})

// same as toObject, but remove uglies
SampleSchema.method('toJSON', function() {
  let obj = this.toObject()
  delete obj._id
  return obj
})

mongoose.model('Sample', SampleSchema)