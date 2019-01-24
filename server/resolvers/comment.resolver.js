const CommentsModel = require('../../models/comments.model')

module.exports = {
  mutations: {
    async addComment (_, args, { db, user }) {
      return (await new CommentsModel(db).add(args, user)).toHexString()
    },
    async patchComment (_, args, { db, user }) {
      const { username } = user
      const query = {
        'author.username': username
      }
      return (await new CommentsModel(db).patch(query, args)).toHexString()
    },
    async deleteComment (_, __, { db, user }) {
      const { username } = user
      const query = {
        'author.username': username
      }
      return (await new CommentsModel(db).delete(query)).toHexString()
    }
  }
}