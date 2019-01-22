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

  async add (doc, author) {
    try {
      await validate(schemaPath, doc)
      return (await this.collection.insertOne({
        ...doc,
        createdAt: new Date(),
        author
      }))
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
      const { _id } = comment
      await validate(schemaPath, fields)
      await this.collection.updateOne({ _id }, { $set: fields })
      return _id
    } catch (error) {
      handleError(error)
    }
  }

  async addReply (doc, author, receiver) {
    try {
      await validate(schemaPath, doc)
      return (await this.collection.insertOne({
        ...doc,
        createdAt: new Date(),
        author,
        receiver
      }))
        .insertedId
    }
    catch (error) {
      handleError(error)
    }
  }
}