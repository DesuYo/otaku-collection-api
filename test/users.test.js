const { connect } = require('mongodb')
const UsersModel = require('../models/users.model')
const { ValidationError, DuplicateDocumentError } = require('../errors')

describe('add user', async () => {
  const dbInstance = (await connect('mongodb://localhost:27018')).db('test')
  const users = new UsersModel(dbInstance)
  await users.initIndexes()

  test('Should throw validation error.', async () => {
    expect(users.add({
      password: 'invalid',
      email: 'someshitty@email'
    })).toThrow(ValidationError)
  })

  test('Should prevent duplicate.', async () => {
    const duplicateFields = {
      username: 'senpai',
      email: 'thisemailshouldwork@gmail.com'
    }
    await users.add({ 
      ...duplicateFields, 
      password: 'someValid5Pass' 
    })
    expect(users.add({ 
      ...duplicateFields, 
      password: 'very4Secret8' 
    })).toThrow(DuplicateDocumentError)
  })

  test('Should add new user.', async () => {
    expect(await users.add({
      username: 'Mayushi',
      password: 'someValid5Pass',
      email: 'mayushi@gmail.com'
    })).toReturn()
  })

  test('Try to update user with invalid info. Should throw validation error.', async () => {
    expect(await users.patch(
      { username: 'Mayushi' },
      { 
        password: '*invalid',
        email: 'new_email_but_invalid@email'
      }
    )).toThrow(ValidationError)
  })

  test('Should update existing user.', async () => {
    expect(await users.patch(
      { username: 'Mayushi' },
      { 
        password: 'new2VALID8Pass9*',
        email: 'new_email@gmail.com'
      }
    )).toReturn()
  })
})





