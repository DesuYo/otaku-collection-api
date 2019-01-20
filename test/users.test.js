const { MongoClient, ObjectID } = require('mongodb')
const UsersModel = require('../models/users.model')
const { ValidationError, DuplicateDocumentError } = require('../errors')

require('dotenv').config()
const mongoClient = new MongoClient(process.env.DB_URI || 'mongodb://localhost:27017/test', 
  { useNewUrlParser: true })
/**
 * @type {UsersModel}
 */
let users = null

describe('test user functionality', () => {
  
  beforeAll (async () => {
    process.DB_CLIENT = (await mongoClient.connect()).db()
    users = new UsersModel(process.DB_CLIENT)
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
      { 
        password: 'new2VALID8Pass9*',
        email: 'newemail@gmail.com'
      }
    ))
      .resolves.toBe(true)
  })
})
