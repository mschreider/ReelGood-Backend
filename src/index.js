// Import needed packages
const dotenv = require('dotenv')
const express = require("express")
const app = express()
const { logger } = require('./logging/logger')

// Log server start
logger.info('Server Initializing...')

// Load config
const configRes = dotenv.config({ 
    path: './configs/config.env' 
})

// Check for config error
if (configRes.error) {
    console.log('Error loading config file')
    console.log(configRes.error.message)
}

// Setup express
const port = process.env.HTTP_PORT
app.use(express.json())

// Setup test route
app.get('/test', function (req, res) {
    res.send('App works!')
})

// Setup api routes
const api = require('./routes/index')
app.use('/api', api)

// Setup database
const database = require('./database/index')

// Initialize Server 
const initializeServer = async () => {

    // Setup database
    const resDb = await database.setup()

    // Check if database has been setup properly
    if (resDb) {
        logger.info('Database ready')
    }
    else {
        logger.error('Critical error setting up database, shutting down')
        process.exit()
    }

    // Start server
    app.listen(port, () => {
        console.log('Server Started on port ' + port)
    })
}

initializeServer()
