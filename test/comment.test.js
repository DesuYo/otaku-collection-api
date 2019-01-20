const { MongoClient, ObjectID } = require('mongodb')
const CommentsModel = require('../models/comments.model')
const { ValidationError, DuplicateDocumentError, NotFoundError } = require('../errors')

require('dotenv').config()
const mongoClient = new MongoClient(process.env.DB_URI || 'mongodb://localhost:27017/test', 
  { useNewUrlParser: true })
/**
 * @type {CommentsModel}
 */
let comments = null

describe('test comment functionality', () => {
  
  beforeAll (async () => {
    comments = new CommentsModel((await mongoClient.connect()).db())
    await comments.collection.deleteMany({})
    await comments.initIndexes()
  })

  it('Should throw validation error.', async () => {
    await expect(comments.add({
      text: `
        roflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflrofl
        roflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflrofl
        roflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflrofl
        roflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflrofl
        roflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflroflrofl
      `
    }))
      .rejects.toThrow(ValidationError)
  })

  it('Should prevent duplicate.', async () => {
    const createdAt = new Date()
    const duplicateFields = {
      text: 'rofl',
      createdAt,
      author: {
        username: 'baka',
        email: 'pahom@gmail.com'
      }
    }
    await comments.add({ 
      ...duplicateFields
    })
    await expect(comments.add({ 
      ...duplicateFields
    }))
      .rejects.toThrow(DuplicateDocumentError)
  })

  it('Should add new comment.', async () => {
    await expect(comments.add({
      text: 'rofl',
      createdAt: new Date(),
      author: {
        username: 'senpai',
        email: 'thisemailshouldwork@gmail.com'
      }
    }))
      .resolves.toBeInstanceOf(ObjectID)
  })

  it('Try to update not existing comment. Should throw not found error.', async () => {
    await expect(comments.patch(
      {
        'author.username': 'rofl'
      }, {
        text: 'nice comment'
      }
    ))
      .rejects.toThrow(NotFoundError)
  })

  it('Try to update comment with invalid info. Should throw validation error.', async () => {
    await expect(comments.patch(
      {
        'author.username': 'senpai'
      }, {
        text: ''
      }
    ))
      .rejects.toThrow(ValidationError)
  })

  it('Should update existing comment.', async () => {
    await expect(comments.patch(
      { 
        'author.username': 'baka'
      }, {
        text: 'nice anime))0'
      }
    ))
      .resolves.toBeInstanceOf(ObjectID)
  })
})