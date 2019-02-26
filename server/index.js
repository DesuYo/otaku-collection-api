const express = require('express')
const { ApolloServer } = require('apollo-server-express')
//const { MongoClient, ObjectId } = require('mongodb')

const typeDefs = require('./schemas/index.schema')
const resolvers = require('../resolvers/index.resolver')

const { handleError } = require('../errors')

;(async () => {
  try {
    //require('dotenv').config()
    //const { DB_URI, PORT } = process.env
    //const mongoClient = new MongoClient(DB_URI || 'mongodb://localhost:27017/test', 
      //{ useNewUrlParser: true })
    //const db = (await mongoClient.connect()).db()
    const app = express()

    new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        //db,
        user: {
          username: 'senpai',
          email: 'thisemailshouldwork@gmail.com'
        },
        commentId: ObjectId('5c533903dffc0408fdbd97b8'),
        genreId: ObjectId('5c534b7b0ee1a50b62bc145e')
      })
    })
      .applyMiddleware({ app })

    app.use((_, res) => {
      return res.status(404).json({
        message: "Resource was not found"
      })
    })
    app.listen(process.env.PORT, () => console.log(`Server runs successfully on port ${process.env.PORT}.`))
  }
  catch (error) {
    handleError(error)
  }
})()