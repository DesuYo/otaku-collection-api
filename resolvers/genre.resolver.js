const GenresModel = require('../models/genres.model')

module.exports = {
  queries: {
    async getGenres (_, args, { db }) {
      const { limit } = args
      return await new GenresModel(db).get(limit)
    }
  },
  mutations: {
    async addGenre (_, args, { db }) {
      return (await new GenresModel(db).add(args)).toHexString()
    },
    async patchGenre (_, args, { db, genreId }) {
      return (await new GenresModel(db).patch(genreId, args)).toHexString()
    },
    async deleteGenre (_, __, { db, genreId }) {
      return await new GenresModel(db).delete(genreId)
    }
  }
}