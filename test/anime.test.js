const { MongoClient, ObjectID, ObjectId } = require('mongodb')
const AnimeModel = require('../models/anime.model')
const { ValidationError, NotFoundError } = require('../errors')

require('dotenv').config()
const mongoClient = new MongoClient(process.env.DB_URI || 'mongodb://localhost:27017/test',
  { useNewUrlParser: true })
/**
 * @type { AnimeModel }
 */
let anime = null
const _id = '5c4c69c0add71b0483f1db42'

describe('test anime model functionality', () => {
  beforeAll(async () => {
    anime = new AnimeModel((await mongoClient.connect()).db())
    await anime.collection.deleteMany()
  })

  it('Tries to add new anime. Should throw validation error on incorrect payload.', async () => {
    await expect(anime.add({
      title: 'Hellsing',
      genres: 'totally not an array'
    })).rejects.toThrowError(ValidationError)
  })

  it('Tries to add new anime. Should throw validation error on identical genres.', async () => {
    await expect(anime.add({
      title: 'Hellsing',
      genres: ['omaewa', 'omaewa']
    })).rejects.toThrowError(ValidationError)
  })

  it('Tries to add new anime. Should throw validation error on empty array of genres.', async () => {
    await expect(anime.add({
      title: 'Hellsing',
      genres: []
    })).rejects.toThrowError(ValidationError)
  })

  it('Should add new anime.', async () => {
    await expect(anime.add({
      title: 'Hellsing',
      genres: ['omaewa', 'moo']
    })).resolves.toBeInstanceOf(ObjectID)
  })

  it('Tries to update existing anime. Should throw validation error on incorrect payload.', async () => {
    await expect(anime.patch(_id, {
      genres: []
    })).rejects.toThrowError(ValidationError)
  })
  
  it('Tries to update existing anime. Should throw validation error on identical genres.', async () => {
    await expect(anime.patch(_id, {
      genres: ['moo', 'omaewa', 'moo']
    })).rejects.toThrowError(ValidationError)
  })

  it('Tries to update existing anime. Should throw not found error on non existing anime.', async () => {
    await expect(anime.patch('5c4c69c0add71b0483f1db58', {
      title: 'Updated Title'
    })).rejects.toThrowError(NotFoundError)
  })

  it('Should update existing anime.', async () => {
    await expect(anime.patch(_id, {
      title: 'Updated title',
      genres: ['the only one']
    })).resolves.toBeInstanceOf(ObjectID)
  })

  it('Should get one anime doc if limit is not specified.', async () => {
    await expect(anime.get()).resolves.toHaveLength(1)
  })

  it('Should get anime.', async () => {
    await expect(anime.get(1)).resolves.toBeInstanceOf(Array)
  })

  it('Tries to delete existing anime. Should throw not found error on non existing anime.', async () => {
    await expect(anime.delete('5c4c69c0add71b0483f1db58'))
      .rejects.toThrowError(NotFoundError)
  })

  it('Should delete existing anime.', async () => {
    await expect(anime.delete(_id))
      .resolves.toBe(true)
  })
})