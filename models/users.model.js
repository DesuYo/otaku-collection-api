const { Db } = require('mongodb')
const ajv = require('../validation')
const { ValidationError, handleError } = require('../errors')

module.exports = class {
  /**
   * @param {Db} dbInstance
   */
  constructor (dbInstance) {
    this.collection = dbInstance.collection('users')
  }

  async initIndexes () {
    return this.collection.createIndex({ username: 1, email: 1 }, { unique: true })
  }

  async _validate (doc) {
    await ajv.validate('otakucollection/user', doc)
    if (ajv.errors) throw new ValidationError(ajv.errors)
  }
  
  async add (doc) {
    try {
      await this._validate(doc)
      return (await this.collection.insertOne(doc))
        .insertedId
    } catch (error) {
      handleError(error)
    }
  }

  async patch (where, fields) {
    try {
      const { _id, ...rest } = await this.collection.findOne(where)
      console.log('USER', await this.collection.findOne(where))
      await this._validate({ ...rest, ...fields })
      await this.collection.updateOne({ _id }, { $set: fields })
      return true
    } catch (error) {
      handleError(error)
    }
  }
}


