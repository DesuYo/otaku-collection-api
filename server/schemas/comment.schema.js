const { gql } = require('apollo-server-express')

module.exports = gql `
  type Comment {
    text: String
    author: String
  }

  extend type Mutation {
    addComment(text: String!): ID!
    patchComment(text: String!): ID!
    getComments(limit: Int!): [Comment]!
    deleteComment: Boolean!
  }
`