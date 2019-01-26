const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { MongoClient, ObjectId } = require('mongodb')

const typeDefs = require('./schemas/index.schema')
const resolvers = require('../resolvers/index.resolver')

const { handleError } = require('../errors')

;(async () => {
  try {
    require('dotenv').config()
    const { DB_URI, PORT } = process.env
    const mongoClient = new MongoClient(DB_URI || 'mongodb://localhost:27017/test', 
      { useNewUrlParser: true })
    const db = (await mongoClient.connect()).db()
    const app = express()

    new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        db,
        user: {
          username: 'senpai',
          email: 'thisemailshouldwork@gmail.com'
        },
        commentId: ObjectId('5c4c69c0add71b0483f1db38')
      })
    })
      .applyMiddleware({ app })
    
    app.listen(PORT || 777, () => console.log(`Server runs successfully on port ${PORT}.`))
  }
  catch (error) {
    handleError(error)
  }
})()