/**
 * File contains logic for making sure database is configured properly on startup
 */
const { logger } = require('../logging/logger');
const { Sequelize } = require('sequelize');
const setupUtils = require('./setup');

/**
 * Set to true once database is setup
 */
let isSetup = false

/**
 * Configure sequelize
 */
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    logging: process.env.DATABASE_LOGGING === 'true' ? console.log : false
})

// Load Models
const rating = require('./models/ratings')(sequelize);

// Database Entites
const entities = {
    ratings: require('./entities/ratings')(rating)
}

const setup = async() => {
    if (isSetup === false) {
        // Connect to database
        try {
            await sequelize.authenticate()
            logger.info('Connection to database been established successfully')
        }
        catch(error) {
            logger.error('Unable to connect to the database:', error)
            return false
        }

        // Synchronize database
        try {
            // Should be used for production
            await sequelize.sync()

            logger.info("Sync complete")
        }
        catch(error) {
            logger.error('Unable to synchronize database:', error)
            return false
        }

        // Setup database
        try {
            // Note order of these functions are important
            await setupUtils.ratings(sequelize)
        }
        catch (error) {
            logger.error('Unable to setup database:', error)
            return false
        }
        
        // Set is setup to true
        isSetup = true
        return true
    }
    else {
        logger.warn("Database already setup")
        return true
    }
}

module.exports = {
    setup, 
    entities
}