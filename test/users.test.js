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

  it('Should throw validation error.', async () => {
    await expect(users.add({
      password: 'invalid',
      email: 'someshitty@email'
    }))
      .rejects.toThrow(ValidationError)
  })

  it('Should prevent duplicate.', async () => {
    const duplicateFields = {
      username: 'senpai',
      email: 'thisemailshouldwork@gmail.com'
    }
    await users.add({ 
      ...duplicateFields, 
      password: 'someValid5Pass' 
    })
    await expect(users.add({ 
      ...duplicateFields, 
      password: 'very4Secret8' 
    }))
      .rejects.toThrow(DuplicateDocumentError)
  })

  it('Should add new user.', async () => {
    await expect(users.add({
      username: 'Mayushi',
      password: 'someValid5Pass',
      email: 'mayushi@gmail.com'
    }))
      .resolves.toBeInstanceOf(ObjectID)
  })

  it('Try to update not existing user. Should throw not found error.', async () => {
    await expect(users.patch(
      { email: '1@gmail.com' },
      { username: 'Mikasa' }
    ))
      .rejects.toThrow(NotFoundError)
  })

  it('Try to update user with invalid info. Should throw validation error.', async () => {
    await expect(users.patch(
      { username: 'Mayushi' },
      { 
        password: '*invalid',
        email: 'new_email_but_invalid@email'
      }
    ))
      .rejects.toThrow(ValidationError)
  })

  it('Should update existing user.', async () => {
    await expect(users.patch(
      { username: 'Mayushi' },
      { email: 'newemail@gmail.com' }
    ))
      .resolves.toBeInstanceOf(ObjectID)
  })
})
