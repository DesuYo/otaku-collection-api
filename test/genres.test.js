const { MongoClient, ObjectID, ObjectId } = require('mongodb')
const GenresModel = require('../models/genres.model')
const { ValidationError, NotFoundError } = require('../errors')

require('dotenv').config()
const mongoClient = new MongoClient(process.env.DB_URI || 'mongodb://localhost:27017/test', 
  { useNewUrlParser: true })
/**
 * @type {GenresModel}
 */
let genres = null
let genreId = ObjectId('5c4c69c0add71b0483f1db40')

describe('test genres functionality', () => {

  beforeAll (async () => {
    genres = new GenresModel((await mongoClient.connect()).db())
    await genres.collection.deleteMany({})
  })

  it('Should throw validation error.', async () => {
    await expect(genres.add({
      name: 'default genre'
    }))
      .rejects.toThrow(ValidationError)
  })

  it('Should add new genre.', async () => {
    await expect(genres.add({
      name: 'nice genre',
      description: 'and very good description'
    }))
      .resolves.toBeInstanceOf(ObjectID)
  })

  it('Try to update not existing genre. Should throw not found error.', async () => {
    await expect(genres.patch(ObjectId('5c4c69c0add71b0483f1db42').toHexString(), {
      description: 'Should not be updated!'
    }))
    .rejects.toThrow(NotFoundError)
  })

  it('Try to update genre with invalid info. Should throw validation error.', async () => {
    await expect(genres.patch(genreId, {
      name: null
    }))
    .rejects.toThrow(ValidationError)
  })

  it('Should update existing genre.', async () => {
    await expect(genres.patch(genreId, {
      name: 'nice genre name))0'
    }))
    .resolves.toBeInstanceOf(ObjectID)
  })

  it('Should get all genres.', async () => {
    await expect(genres.get(10))
      .resolves.toBeInstanceOf(Array)
  })

  it('Should delete existing comment.', async () => {
    await expect(genres.delete(genreId))
    .resolves.toBe(true)
  })

})