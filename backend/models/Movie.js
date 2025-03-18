import mongoose from 'mongoose'

// Für mehr paramter eines Films müssen diese hier hinzugefügt werden
// Für Infos schau hier: https://mongoosejs.com/docs/schematypes.html
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  director: String,
  year: Number,
  ImdbRate: Number,
  language: Array,
  movieId: {
    type: Number,
    required: true,
  },
  personalRating: Number,
})

// create a unique compound index on userId and movieId
// makes sure that a user can't add the same movie twice
movieSchema.index({ userId: 1, movieId: 1 }, { unique: true })

const Movie = mongoose.model('Movie', movieSchema)

export default Movie
