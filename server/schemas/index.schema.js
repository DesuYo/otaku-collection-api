const { gql } = require('apollo-server-express')

const Comment = require('./comment.schema')
const Genre = require('./genre.schema')

module.exports = [
  gql `
    type Query { _: Int }
    type Mutation { _: Int }
  `,
  Comment,
  Genre
]