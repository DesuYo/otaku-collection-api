const comment = require('./comment.resolver')
const genre = require('./genre.resolver')

module.exports = {
  Mutation: {
    ...comment.mutations,
    ...genre.mutations
  }
}