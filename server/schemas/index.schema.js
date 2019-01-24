const { gql } = require('apollo-server-express')
const Comment = require('./comment.schema')

module.exports = [
  gql `
    type Query { _: Int }
    type Mutation { _: Int }
  `,
  Comment
]