const { MongoClient, ObjectID, ObjectId } = require('mongodb')
const CommentsModel = require('../models/comments.model')
const { ValidationError, NotFoundError } = require('../errors')

require('dotenv').config()
const mongoClient = new MongoClient(process.env.DB_URI || 'mongodb://localhost:27017/test', 
  { useNewUrlParser: true })
/**
 * @type {CommentsModel}
 */
let comments = null
let commentId = ObjectId('5c4c69c0add71b0483f1db38')
let user = {
  username: 'senpai',
  email: 'thisemailshouldwork@gmail.com'
}

describe('test comment functionality', () => {
  
  beforeAll (async () => {
    comments = new CommentsModel((await mongoClient.connect()).db())
    await comments.collection.deleteMany({})
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
    }, user))
      .rejects.toThrow(ValidationError)
  })

  it('Should add new comment.', async () => {
    await expect(comments.add({
      text: 'rofl'
    }, user))
      .resolves.toBeInstanceOf(ObjectID)
  })

  it('Should add new reply.', async () => {
    await expect(comments.addReply(commentId, user, {
        text: 'actually very nice anime.'
      }))
      .resolves.toBeInstanceOf(ObjectID)
  })

  it('Try to update not existing comment. Should throw not found error.', async () => {
    await expect(comments.patch(ObjectId('5c4c69c0add71b0483f1db37').toHexString(), user, {
      text: 'Should not be updated!'
    }))
    .rejects.toThrow(NotFoundError)
  })

  it('Try to update comment with invalid info. Should throw validation error.', async () => {
    await expect(comments.patch(commentId, user, {
      text: null
    }))
    .rejects.toThrow(ValidationError)
  })

  it('Should update existing comment.', async () => {
    await expect(comments.patch(commentId, user, {
      text: 'nice anime))0'
    }))
    .resolves.toBeInstanceOf(ObjectID)
  })

  it('Should switch comment\'s like.', async () => {
    await expect(comments.switchLike(commentId, user))
    .resolves.toBeInstanceOf(ObjectID)
  })

  it('Should switch comment\'s dislike.', async () => {
    await expect(comments.switchDislike(commentId, user))
    .resolves.toBeInstanceOf(ObjectID)
  })

  it('Should delete existing comment.', async () => {
    await expect(comments.delete(commentId, user))
    .resolves.toBe(true)
  })
})