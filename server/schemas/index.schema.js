const { gql } = require('apollo-server-express')

const Comment = require('./comment.schema')
const Anime = require('./anime.schema')
const outputPayload = require('./outputPayload.schema')

module.exports = [
  gql `
    type Query { _: Int }
    type Mutation { _: Int }
  `,
  Comment,
  Anime,
  outputPayload
]