const { Db } = require('mongodb')
const ajv = require('../validation')
const { ValidationError, handleError } = require('../errors')

module.exports = class {
  /**
   * @param {Db} dbInstance
   */
  constructor (dbInstance) {
    this.users = dbInstance.collection('users')
  }

  async initIndexes () {
    return this.users.createIndex({ username: 1, email: 1 }, { unique: true })
  }

  async _validate (doc) {
    await ajv.validate('otakucollection/user', doc)
    if (ajv.errors) throw new ValidationError(ajv.errors)
  }
  
  async add (doc) {
    try {
      await this._validate(doc)
      return (await this.users.insertOne(doc))
        .insertedId
    } catch (error) {
      handleError(error)
    }
  }

  async patch (where, fields) {
    try {
      const { _id, rest } = await this.users.findOne(where)
      await this._validate({ ...rest, ...fields })
      return (await this.users.updateOne({ _id }, { $set: fields }))
        .upsertedId._id
    } catch (error) {
      handleError(error)
    }
  }
}


