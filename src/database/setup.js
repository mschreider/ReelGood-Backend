/**
 * File contains logic for making sure databse is configured properly on startup
 */
const { logger } = require('../logging/logger')
const { Op } = require('sequelize')

const ratings = async (rating) => {
    const findOrCreateRating = async (movie_id = '', movie_title = '', rating = '') => {
        await rating.findOrCreate({
            where: {
                movie_id: movie_id,
            },
            defaults: {
                movie_id: movie_id,
                movie_title: movie_title,
                rating: rating
            }
        })
    }
}

module.exports = {
    ratings
}