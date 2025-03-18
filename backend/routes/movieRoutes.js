import express from 'express'
import Movie from '../models/Movie.js'
import checkJwt from '../jwt.js'

const router = express.Router()

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Adds a new movie to the list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - director
 *               - userId
 *               - movieId
 *             properties:
 *               title:
 *                 type: string
 *               userId:
 *                 type: string
 *               director:
 *                 type: string
 *               year:
 *                 type: number
 *               ImdbRate:
 *                 type: number
 *               language:
 *                 type: array
 *                 items:
 *                   type: string
 *               movieId:
 *                 type: number
 *               personalRating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Returns the newly created movie
 *       400:
 *         description: Bad request
 */
router.post('/api/movies', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.sub
    const movie = new Movie({ ...req.body, userId })
    await movie.save()
    res.status(201).send(movie)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

/**
 * @swagger
 * /api/movies/{id}:
 *   patch:
 *     summary: Updates an existing movie
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               director:
 *                 type: string
 *               year:
 *                 type: number
 *               ImdbRate:
 *                 type: number
 *               language:
 *                 type: array
 *                 items:
 *                   type: string
 *               personalRating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Returns the updated movie
 *       400:
 *         description: Bad request
 *       404:
 *         description: Movie not found
 */
router.patch('/api/movies/:id', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.sub
    const movie = await Movie.findOneAndUpdate({ movieId: req.params.id, userId }, req.body, {
      new: true,
    })
    if (!movie) {
      return res.status(404).send()
    }
    res.send(movie)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Deletes a movie from the list
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Returns the deleted movie
 *       404:
 *         description: Movie not found
 */
router.delete('/api/movies/:id', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.sub
    const movie = await Movie.findOneAndDelete({ movieId: req.params.id, userId })
    if (!movie) {
      return res.status(404).send()
    }
    res.send({ message: `Movie ${movie.title} deleted` })
  } catch (error) {
    res.status(500).send(error)
  }
})

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Retrieves all movies
 *     responses:
 *       200:
 *         description: Returns all movies
 *       500:
 *         description: Internal server error
 */
router.get('/api/movies', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.sub
    const movies = await Movie.find({ userId })
    res.send(JSON.stringify(movies, null, 2))
  } catch (error) {
    res.status(500).send(error)
  }
})

/**
 * @swagger
 * /api/movies/{movieId}:
 *   get:
 *     summary: Retrieves a movie by movieId and userId
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: number
 *         required: true
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Returns the movie
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.get('/api/movies/:movieId', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.sub
    const movie = await Movie.findOne({ movieId: req.params.movieId, userId })
    if (!movie) {
      return res.status(404).send({ message: 'Movie not found' })
    }
    res.send(movie)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

export default router
