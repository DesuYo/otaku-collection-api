const { Db, ObjectId } = require('mongodb')
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
        //FOR TESTING ONLY
        //_id: ObjectId('5c4c69c0add71b0483f1db38'),
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

  async patch (commentId, author, fields) {
    try {
      const query = {
        _id: commentId,
        'author.username': author.username
      }
      const comment = await this.collection.findOne(query)
      if (!comment) throw new NotFoundError({ message: 'Comment not found.' })
      const { _id } = comment
      await validate(schemaPath, fields)
      await this.collection.updateOne({ _id }, { $set: fields })
      return _id
    } catch (error) {
      handleError(error)
    }
  }

  async get (limit) {
    try {
      return await this.collection.find()
        .limit(limit)
        .toArray()
    }
    catch (error) {
      handleError(error)
    }
  }

  async delete(commentId, author) {
    try {
      const query = {
        _id: commentId,
        'author.username': author.username
      }
      const comment = await this.collection.findOne(query)
      if (!comment) throw new NotFoundError({ message: 'Comment not found.' })
      const { _id } = comment
      await this.collection.deleteOne({ _id })
      return true
    }
    catch (error) {
      handleError(error)
    }
  }

  async addReply (commentId, author, fields) {
    try {
      const comment = await this.collection.findOne({ _id: commentId })
      if (!comment) throw new NotFoundError({ message: 'Comment not found.' })
      await validate(schemaPath, fields)
      const reply = {
        ...fields,
        createdAt: new Date(),
        author
      }
      const { _id } = comment
      await this.collection.updateOne({ _id }, { $push: { replies: reply }})
      return _id
    }
    catch (error) {
      handleError(error)
    }
  }

  async switchLike (commentId, author) {
    try {
      const comment = await this.collection.findOne({ _id: commentId })
      if (!comment) throw new NotFoundError({ message: 'Comment not found.' })
      const { _id } = comment
      const like = await this.collection.find({ _id, likes: author }).count()
      like 
      ? await this.collection.updateOne({ _id }, { $pull: { likes: author }})
      : await this.collection.updateOne({ _id }, { $push: { likes: author }})
      const oppositeDislike = await this.collection.find({ _id, dislikes: author }).count()
      if (oppositeDislike) await this.collection.updateOne({ _id }, { $pull: { dislikes: author }})
      return _id
    }
    catch (error) {
      handleError(error)
    }
  }

  async switchDislike (commentId, author) {
    try {
      const comment = await this.collection.findOne({ _id: commentId })
      if (!comment) throw new NotFoundError({ message: 'Comment not found.' })
      const { _id } = comment
      const dislike = await this.collection.find({ _id, dislikes: author }).count()
      dislike 
      ? await this.collection.updateOne({ _id }, { $pull: { dislikes: author }})
      : await this.collection.updateOne({ _id }, { $push: { dislikes: author }})
      const oppositeLike = await this.collection.find({ _id, likes: author }).count()
      if (oppositeLike) await this.collection.updateOne({ _id }, { $pull: { likes: author }})
      return _id
    }
    catch (error) {
      handleError(error)
    }
  }

}