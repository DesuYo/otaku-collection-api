const { ObjectId } = require('mongodb')

const validate = require('../validation')
const { NotFoundError, handleError } = require('../errors')

const schemaPath = 'otakucollection/genre'

module.exports = class {
  /**
 * @param {Db} dbInstance
 */
  constructor (dbInstance) {
    this.collection = dbInstance.collection('genres')
  }

  async add (doc) {
    try {
      await validate(schemaPath, doc)
      return (await this.collection.insertOne({
        //FOR TESTING ONLY
        //_id: ObjectId('5c4c69c0add71b0483f1db40'),
        ...doc
      }))
        .insertedId
    }
    catch (error) {
      handleError(error)
    }
  }

  async patch (genreId, fields) {
    try {
      const genre = await this.collection.findOne({ _id: genreId })
      if (!genre) throw new NotFoundError({ message: 'Genre not found.' })
      const { _id, ...rest } = genre
      await validate(schemaPath, { ...rest, ...fields})
      await this.collection.updateOne({ _id }, { $set: fields })
      return _id
    }
    catch (error) {
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

  async delete (genreId) {
    try {
      const genre = await this.collection.findOne({ _id: genreId })
      if (!genre) throw new NotFoundError({ message: 'Genre not found.' })
      const { _id } = genre
      await this.collection.deleteOne({ _id })
      return true
    }
    catch (error) {
      handleError(error)
    }
  }
}