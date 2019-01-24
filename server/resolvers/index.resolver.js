const comment = require('./comment.resolver')

module.exports = {
  Mutation: {
    ...comment.mutations
  }
}