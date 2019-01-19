const AJV = require('ajv')()

module.exports = AJV.addSchema([
  require('./user.draft.json'),
  //...
])