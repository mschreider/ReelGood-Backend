const router = require('express').Router()
const validators = require("../validators/index")
const ratingsController = require('../controllers/ratings')
const asyncHandler = require('express-async-handler')
const { toPascalCase } = require('../utils/json')
const { confirmRequest } = require('../middleware/confirmPermissions')
const { validateUrlParams, validateBody, validateQueryParams } = require("../middleware/validateRequest")
const { confirmRightsAuto } = require('../middleware/confirmRights')


/**
 * Handle rout GET /api/ratings/{movie_id}
 * Get rating of movie
 */
router.get('/:id', confirmRequest, validateUrlParams(validators.generic.validateIdUrlParam), confirmRightsAuto, asyncHandler(async(req, res) => {
    // Get subscription id
    const subscriptionId = req.params.id
    let subscriptionRes

    // Check for populate
    if (req.query.populate === "simple") {
        subscriptionRes = await subscriptionController.getSubscription(subscriptionId, {populate: "simple"})
    }
    else {
        subscriptionRes = await subscriptionController.getSubscription(subscriptionId)
    }

    // Check subscription result
    if (subscriptionRes !== null) {
        // Send back response json
        res.json(toPascalCase(subscriptionRes))
    }
    else {
        // Set response error
        res.status(400)

        // Send back error json
        res.json({
            ErrorCode: 400,
            ErrorDescription: 'Bad Request',
        })
    } 
}))

/**
 * Handle rout POST /api/ratings
 * Create a new rating
 */
router.post('/', confirmRequest, validateBody(validators.subscriptions.validateAddSubscriptionBody), confirmRightsAuto, asyncHandler(async(req, res) => {
    // Create new rating
    let ratingRes = await ratingsController.addRaing({
        
    }, req.session.user.id)
    
    // Check subscription result
    if (subscriptionRes !== null) {
        // Send back response json
        res.json(toPascalCase(subscriptionRes))
    }
    else {
        // Set response error
        res.status(400)

        // Send back error json
        res.json({
            ErrorCode: 400,
            ErrorDescription: 'Bad Request',
        })
    } 
}))

/**
 * Handle rout PUT /api/subscriptions/{id}
 * Edit specified subscription id
 */
router.put('/:id', confirmRequest, validateUrlParams(validators.generic.validateIdUrlParam), validateBody(validators.subscriptions.validateEditSubscriptionBody), confirmRightsAuto, asyncHandler(async(req, res) => {
    // Edit subscription
    let subscriptionRes = await subscriptionController.editSubscription(req.params.id, {
        name: req.body.Name, 
        siteId: req.body.Site, 
        type: req.body.Type, 
        deviceIds: req.body.Devices, 
        listIds: req.body.Lists, 
        siteIds: req.body.Sites,
        userIds: req.body.Users, 
        groupIds: req.body.Groups, 
        startTime: req.body.StartTime, 
        endTime: req.body.EndTime, 
        sunday: req.body.Sunday, 
        monday: req.body.Monday, 
        tuesday: req.body.Tuesday, 
        wednesday: req.body.Wednesday, 
        thursday: req.body.Thursday, 
        friday: req.body.Friday, 
        saturday: req.body.Saturday,
        isActive: req.body.IsActive, 
        alertTypes: req.body.AlertTypes
    }, req.session.user.id)
    
    // Check subscription result
    if (subscriptionRes === true) {
        // Send back susses
        res.send()
    }
    else {
        // Set response error
        res.status(400)

        // Send back error json
        res.json({
            ErrorCode: 400,
            ErrorDescription: 'Bad Request',
        })
    }
}))

/**
 * Handle rout DELETE /api/subscriptions/{id}
 * Delete specified subscription id
 */
router.delete('/:id', confirmRequest, validateUrlParams(validators.generic.validateIdUrlParam), confirmRightsAuto, asyncHandler(async(req, res) => {
    // Make delete subscription request
    let subscriptionRes = await subscriptionController.deleteSubscription(req.params.id, req.session.user.id)

    // Check subscription result
    if (subscriptionRes) {
        // Send back success
        res.send()
    }
    else {
        // Set response error
        res.status(400)

        // Send back error json
        res.json({
            ErrorCode: 400,
            ErrorDescription: 'Bad Request',
        })
    }
}))

// Export router
module.exports = router