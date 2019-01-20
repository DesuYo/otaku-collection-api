const { MongoClient } = require('mongodb')

module.exports = async () => {
  require('dotenv').config()
  const mongoClient = new MongoClient(process.env.DB_URI || 'mongodb://localhost:27017/test', 
    { useNewUrlParser: true })
  process.DB_CLIENT = (await mongoClient.connect()).db()
}