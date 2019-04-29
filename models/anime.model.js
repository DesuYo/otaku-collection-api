const { Db, ObjectId } = require('mongodb')

const validate = require('../validation')
const { NotFoundError, handleError } = require('../errors')

const schemaPath = {
  add: 'otakucollection/anime-add',
  patch: 'otakucollection/anime-patch'
}

module.exports = class {
  /**
   * @constructor
   * @param {Db} dbInstance
   */
  constructor (dbInstance) {
    this.collection = dbInstance.collection('anime')
  }

  async add (doc) {
    try {
      const { add } = schemaPath
      await validate(add, doc)
      return (await this.collection.insertOne({
        //ID FIELD IS FOR TESTING ONLY
        //_id: ObjectId('5c4c69c0add71b0483f1db42'),
        ...doc
      }))
        .insertedId
    }
    catch (error) {
      handleError(error)
    }
  }

  async patch (id, fields) {
    try {
      const anime = await this.collection.findOne({ _id: ObjectId(id) })
      if (!anime) throw new NotFoundError({ message: 'Anime is not found.' })
      const { _id, ...rest } = anime
      const { patch } = schemaPath
      await validate(patch, { ...rest, ...fields })
      await this.collection.updateOne({ _id }, { $set: { ...fields } })
      return _id
    }
    catch (error) {
      handleError(error)
    }
  }

  async get (limit = 1) {
    try {
      return await this.collection.find()
        .limit(limit)
        .toArray()
    }
    catch (error) {
      handleError(error)
    }
  }

  async delete (id) {
    try {
      const anime = await this.collection.findOne({ _id: ObjectId(id) })
      if (!anime) throw new NotFoundError({ message: 'Anime is not found.' })
      const { _id } = anime
      await this.collection.deleteOne({ _id })
      return true
    }
    catch (error) {
      handleError(error)
    }
  }
}