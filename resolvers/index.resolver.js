const comment = require('./comment.resolver')
const anime = require('./anime.resolver')
const outputPayload = require('./outputPayload.resolver')

module.exports = {
  Query: {
    ...anime.queries,
    ...outputPayload.queries
  },
  Mutation: {
    ...anime.mutations,
    ...comment.mutations
  }
}