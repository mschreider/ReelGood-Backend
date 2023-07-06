const router = require('express').Router()
const ratings = require('./ratings')

// Setup routes
router.use('/ratings', ratings)

// Export router
module.exports = router