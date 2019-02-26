const comment = require('./comment.resolver')
const genre = require('./genre.resolver')
const outputPayload = require('./outputPayload.resolver')

module.exports = {
  Query: {
    ...genre.queries,
    ...outputPayload.queries
  },
  Mutation: {
    ...comment.mutations,
    ...genre.mutations
  }
}