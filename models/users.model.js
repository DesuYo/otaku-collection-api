const { Db } = require('mongodb')
const validate = require('../validation')
const { hash } = require('bcryptjs')
const { NotFoundError, handleError } = require('../errors')

const schemaPath = 'otakucollection/user'

module.exports = class {
  /**
   * @param {Db} dbInstance
   */
  constructor (dbInstance) {
    this.collection = dbInstance.collection('users')
    await this.initIndexes()
  }

  async initIndexes () {
    return this.collection.createIndex({ username: 1, email: 1 }, { unique: true })
  }
  
  async add (doc) {
    try {
      const { password, ...profile } = doc
      await validate(schemaPath, { password, profile })
      return (await this.collection.insertOne({
        ...profile,
        password: await hash(password, 12) 
      }))
        .insertedId
    } catch (error) {
      handleError(error)
    }
  }

  async patch (where, fields) {
    try {
      const user = await this.collection.findOne(where)
      if (!user) throw new NotFoundError({ message: 'User not found.' })
      const { _id, password, ...rest } = user
      await validate(`${schemaPath}#/properties/profile`, { ...rest, ...fields })
      await this.collection.updateOne({ _id }, { $set: fields })
      return _id
    } catch (error) {
      handleError(error)
    }
  }

  async setPassword (where, password) {
    try {
      await validate(`${schemaPath}#/properties/password`)
      await this.collection.updateOne(where, { $set: { 
        password: await hash(password, 12) 
      }})
      return true
    } catch (error) {
      handleError(error)
    }
  }
}


