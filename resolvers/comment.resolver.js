const CommentsModel = require('../models/comments.model')

module.exports = {
  mutations: {
    async addComment (_, args, { db, user }) {
      return (await new CommentsModel(db).add(args, user)).toHexString()
    },
    async patchComment (_, args, { db, commentId, user }) {
      return (await new CommentsModel(db).patch(commentId, user, args)).toHexString()
    },
    async deleteComment (_, __, { db, commentId, user }) {
      return await new CommentsModel(db).delete(commentId, user)
    }
  }
}