const express = require('express')
const { MongoClient } = require('mongodb')
const { ApolloServer } = require('apollo-server-express')

const typeDefs = require('./schemas/index.schema')
const resolvers = require('../resolvers/index.resolver')

const { handleError } = require('../errors')

;(async () => {
  try {
    //require('dotenv').config()
    const { DB_URI, PORT } = process.env
    const mongoClient = new MongoClient(DB_URI || 'mongodb://localhost:27017/test', 
      { useNewUrlParser: true })
    const db = (await mongoClient.connect()).db()
    const app = express()

    new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      playground: true,
      context: () => ({
        db,
        user: {
          username: 'senpai'
        }
      })
    })
      .applyMiddleware({ app })

    app
    .use((_, res) => {
      return res.status(404).json({
        message: "Resource was not found"
      })
    })
    .listen(process.env.PORT, () => console.log(`Server runs successfully on port ${PORT}.`))
  }
  catch (error) {
    handleError(error)
  }
})()