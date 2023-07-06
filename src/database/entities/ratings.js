const { logger } = require('../../logging/logger')
const { Op, Sequelize } = require("sequelize")

/**
 * Functions for working with ratings entities
 * @param {object} alert sequelize alert model to use
 * @returns Functions for working with ratings entities
 */
const ratings = (rating) => {
    return {
        /**
         * Get rating by movie id
         * @param {string} id movie id to get
         * @returns Promise that returns a rating object or null if not found
         */
        getByMovieId: async (movie_id) => {
            const res = await rating.findAll({
                where: {
                    movie_id: movie_id,
                }
            })

            if (res.length === 1) {
                return res[0].dataValues
            }
            else if (res.length === 0) {
                return null
            }
            else {
                logger.warn('Get alert by id returned length of ' + res.length)
                return null
            }
        },

        add: async ({movie_id = '', movie_title = '', rating = ''} = {}, createdById = null) => {
            try {
                let res = await rating.create({
                    movie_id: movie_id,
                    movie_title: movie_title,
                    rating: rating
                })
                return res.dataValues
            }
            catch (err) {
                logger.warn('Error adding subscription: ' + err)
                return null
            }
        },

        edit: async (movie_id, {rating = ''} = {}, editedById = null) => {
            try {
                let res = await rating.update({
                    ...(rating !== '' && {rating: rating})
                },
                {
                    where: {
                        movie_id: movie_id,
                    },
                    returning: true
                })
                if (res.length === 2 && res[1].length === 1) {
                    return res[1][0].dataValues
                }
                else {
                    logger.warn('Edit rating returned length of ' + res.length + (res.length >= 2 ? ' and a lenth of ' + res[1].length : ''))
                    return null
                }
            }
            catch (e) {
                logger.warn('Error editing subscription: ' + e)
                return null
            }
        }
        
    }
}

module.exports = ratings