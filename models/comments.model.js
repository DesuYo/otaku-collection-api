const { Db } = require('mongoddb')
const ajv = require('../validation')
const { ValidationError, handleError } = require('../errors')

module.exports = class {
  constructor (dbInstance) {
    this.collection = dbInstance.collection('comments')
  }

  async initIndexes() {
    
  }
}