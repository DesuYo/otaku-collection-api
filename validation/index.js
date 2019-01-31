const ajv = require('ajv')()
const { ValidationError } = require('../errors')

ajv.addSchema([
  require('./user.draft.json'),
  require('./comment.draft.json'),
  require('./genre.draft.json')
  //...
])

module.exports = async (path, doc) => {
  await ajv.validate(path, doc)
  if (ajv.errors) throw new ValidationError(ajv.errors)
}