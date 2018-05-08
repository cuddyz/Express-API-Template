
const logger = require('../lib/logger')

class Rest {

  constructor(resource, hasLogicalDelete) {
    this.resource = resource
    this.hasLogicalDelete = hasLogicalDelete
  }

  async list(req, res, next) {
    const query = {}
    if (this.hasLogicalDelete) {
      if (req.query.isDeleted) {
        query.isDeleted = (req.query.isDeleted === "true")
      } else {
        query.isDeleted = false
      }
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : 1000
    const sort = this.sort ? this.sort : {lastUpdated: -1}
    const instances = await this.resource.find(query).sort(sort).limit(limit).exec()
    res.json(instances)
  }

  async show(req, res, next) {
    let instance = await this.resource.findById(req.params.id).exec()
    if (!instance) {
      const err = new Error("not found")
      err.status = 404
      return next(err)
    }
    res.json(instance)
  }

  async create(req, res, next) {
    const instance = new this.resource(req.body)
    try {
      await instance.validate()
    } catch (e) {
      logger.error(`instance failed validation: ${e.message}`)
      const err = new Error(`instance failed validation ${e.message}`)
      err.status = 422
      return next(err)
    }
    await instance.save()
    res.json(instance)
  }

  async update(req, res, next) {
    let instance = await this.resource.findOneAndUpdate({_id: req.params.id}, req.body, {'new': true}).exec()
    if (!instance) {
      const err = new Error("not found")
      err.status = 404
      return next(err)
    }

    res.json(instance)
  }

  async remove(req, res, next) {
    let instance
    if (this.hasLogicalDelete) {
      instance = await this.resource.findOne({_id: req.params.id}).exec()
      if (!instance) {
        const err = new Error("not found")
        err.status = 404
        return next(err)
      }

      instance.isDeleted = true

      await this.resource.update({_id: req.params.id}, instance)
    } else {
      instance = await this.resource.findOneAndRemove({_id: req.params.id}).exec()
      if (!instance) {
        const err = new Error("not found")
        err.status = 404
        return next(err)
      }
    }
    res.json(instance)
  }
}

module.exports = Rest