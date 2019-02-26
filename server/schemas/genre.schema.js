const { gql } = require('apollo-server-express')

module.exports = gql `
  type Genre {
    name: String,
    description: String
  }

  extend type Query {
    getGenres(limit: Int!): [Genre]!
  }
  
  extend type Mutation {
    addGenre(name: String!, description: String!): ID!
    patchGenre(name: String, description: String): ID!
    deleteGenre: Boolean!
  }
`