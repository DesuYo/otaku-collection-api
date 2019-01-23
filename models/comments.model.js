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
      const reply = {
        ...doc,
        createdAt: new Date(),
        author
      }
      await this.collection.updateOne({ author: receiver}, { $push: { replies: reply }})
      return (await this.collection.insertOne(reply))
        .insertedId
    }
    catch (error) {
      handleError(error)
    }
  }

  async switchLike (where, author) {
    try {
      const comment = await this.collection.findOne(where)
      if (!comment) throw new NotFoundError({ message: 'Comment not found.' })
      const { _id } = comment
      const like = await this.collection.find({ ...where, likes: author }).count()
      like 
      ? await this.collection.updateOne({ _id }, { $pull: { likes: author }})
      : await this.collection.updateOne({ _id }, { $push: { likes: author }})
      const oppositeDislike = await this.collection.find({ ...where, dislikes: author })
      oppositeDislike
      ? await this.collection.updateOne({ _id }, { $pull: { dislikes: author }})
      : null
      return _id
    }
    catch (error) {
      handleError(error)
    }
  }

  async switchDislike (where, author) {
    try {
      const comment = await this.collection.findOne(where)
      if (!comment) throw new NotFoundError({ message: 'Comment not found.' })
      const { _id } = comment
      const dislike = await this.collection.find({ ...where, dislikes: author }).count()
      dislike 
      ? await this.collection.updateOne({ _id }, { $pull: { dislikes: author }})
      : await this.collection.updateOne({ _id }, { $push: { dislikes: author }})
      const oppositeLike = await this.collection.find({ ...where, likes: author })
      oppositeLike
      ? await this.collection.updateOne({ _id }, { $pull: { likes: author }})
      : null
      return _id
    }
    catch (error) {
      handleError(error)
    }
  }

}