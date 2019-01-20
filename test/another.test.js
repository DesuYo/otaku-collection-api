const { MongoClient, ObjectID, Db } = require('mongodb')
const UsersModel = require('../models/users.model')
const { ValidationError, DuplicateDocumentError, NotFoundError } = require('../errors')

const mongoClient = new MongoClient('mongodb://localhost:27017/test', { useNewUrlParser: true })
/**
 * @type {UsersModel}
 */
let users = null

describe('add user', () => {
  
  beforeAll (async () => {
    users = new UsersModel((await mongoClient.connect()).db())
    await users.collection.deleteMany({})
    await users.initIndexes()
  })

  //afterAll (async () => await mongoClient.close())

  it('Should add new user.', async () => {
    await expect(users.add({
      username: 'Rin',
      password: 'someValid5Pass44',
      email: 'rin-vocaloid@gmail.com'
    }))
      .resolves.toBeInstanceOf(ObjectID)
  })
})