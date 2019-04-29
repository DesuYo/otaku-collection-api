const AnimeModel = require('../models/anime.model')

module.exports = {
  queries: {
    async getAnime (_, { limit }, { db }) {
      return await new AnimeModel(db).get(limit)
    }
  },
  mutations: {
    async addAnime (_, args, { db }) {
      return (await new AnimeModel(db).add(args)).toHexString()
    },
    async patchAnime (_, { animeId, fields }, { db }) {
      return (await new AnimeModel(db).patch(animeId, fields)).toHexString()
    },
    async deleteAnime (_, { animeId }, { db }) {
      return await new AnimeModel(db).delete(animeId)
    }
  }
}