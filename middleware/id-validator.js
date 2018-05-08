const ObjectId = require('mongoose').Types.ObjectId

module.exports = function(req, res, next) {
  if(!ObjectId.isValid(req.params.id)) {
    const err = new Error("id is not a valid format")
    err.status = 400
    next(err)
    return
  }
  next()
}