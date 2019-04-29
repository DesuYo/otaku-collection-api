const { gql } = require('apollo-server-express')

module.exports = gql `
  type Anime {
    title: String
    genres: [String!]
  }

  input AnimeInput {
    title: String
    genres: [String!]
  }

  extend type Query {
    getAnime(limit: Int!): [Anime]!
  }

  extend type Mutation {
    addAnime(title: String!, genres: [String!]!): ID!
    patchAnime(animeId: ID!, fields: AnimeInput!): ID!
    deleteAnime(animeId: ID!): Boolean!
  }
`