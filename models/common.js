module.exports.auditFields = function (schema, options) {

    schema.add({
      dateCreated: Date,
      lastUpdated: Date
    })
  
    schema.pre('save', function (next) {
      const now = new Date()
      if (this.isNew) {
        this.dateCreated = now
      }
      this.lastUpdated = now
      next()
    })
  
    function updateLastUpdated (next) {
      this._update = this._update || {}
      delete this._update.createdAt
      this._update.lastUpdated = new Date()
      next()
    }
  
    schema.pre('update', updateLastUpdated)
    schema.pre('findOneAndUpdate', updateLastUpdated)
  }