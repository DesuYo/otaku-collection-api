const { gql } = require('apollo-server-express')

module.exports = gql `
  extend type Mutation {
    addComment(text: String!): ID!
    patchComment(text: String!): ID!
    deleteComment: ID!
  }
`