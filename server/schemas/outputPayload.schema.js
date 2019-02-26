const { gql } = require('apollo-server-express')

module.exports = gql `
  type Payload {
    field1: String,
    field2: String,
    field3: String
  }

  extend type Query {
    outputPayload(field1: String, field2: String, field3: String): Payload
  }
`