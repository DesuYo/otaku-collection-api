const { Db } = require('mongodb')
const validate = require('../validation')
const { NotFoundError, handleError } = require('../errors')

const schemaPath = 'otakucollection/comment'

module.exports = class {
    /**
   * @param {Db} dbInstance
   */
  constructor (dbInstance) {
    this.collection = dbInstance.collection('comments')
  }

  async initIndexes() {
    return this.collection.createIndex({
      createdAt: 1
    }, {
      unique: true
    })
  }

  async add (doc) {
    try {
      await validate(schemaPath, doc)
      return (await this.collection.insertOne(doc))
        .insertedId
    }
    catch (error) {
      handleError(error)
    }
  }

  async patch (where, fields) {
    try {
      const comment = await this.collection.findOne(where)
      if (!comment) throw new NotFoundError({ message: 'Comment not found.' })
      const { _id, text } = comment
      await validate(schemaPath, { text, ...fields })
      await this.collection.updateOne({ _id }, { $set: fields })
      return _id
    } catch (error) {
      handleError(error)
    }
  }
}