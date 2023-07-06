/**
 * Functions managing subscriptions
 */
 const { logger } = require('../logging/winston')
 const { populateLastEditedBySimple, populateCreatedBySimple, populateSiteSimple, populateDevicesSimple, populateUsersSimple, populateSitesSimple, populateGroupsSimple, populateListsSimple, populateAlertTypesSimple } = require('../utils/populate')
 const { cleanCreatedBy, cleanLastEditedBy, cleanSite } = require('../utils/clean')
 const database = require('../database/index')
 
 
 /**
  * Get rating by movie id
  * @param {string} id id of subscription to get
  * @param {object} options Options object
  * @param {string} options.populate populate mode, defaults to none. supports "none" or "simple"
  * @returns Promise that returns a subscription object on success or null on error
  */
 const getRating = async (id, {populate = "none"}={}) => {
     // Get database subscription
     let subscriptionRes = await database.entities.subscriptions.getById(id)
     
     // Check for database error
     if (subscriptionRes === null) {
         logger.warn('Get subscription failed, subscription does not exist')
         return null
     }
 
     let finalRes = subscriptionRes
     
     // Check if object should be populated
     if (populate === "simple") {
         // Populate
         finalRes = await populateCreatedBySimple(finalRes)
         finalRes = await populateLastEditedBySimple(finalRes)
         finalRes = await populateSiteSimple(finalRes)
         finalRes = await populateDevicesSimple(finalRes)
         finalRes = await populateUsersSimple(finalRes)
         finalRes = await populateSitesSimple(finalRes)
         finalRes = await populateGroupsSimple(finalRes)
         finalRes = await populateListsSimple(finalRes)
         finalRes = await populateAlertTypesSimple(finalRes) 
     }
     else {
         // Clean all
         finalRes = cleanCreatedBy(finalRes)
         finalRes = cleanLastEditedBy(finalRes)
         finalRes = cleanSite(finalRes)
     }
 
     return finalRes
 }
 
 /**
  * Add subscription 
  * @param {object} properties Object of subscription properties to set
  * @param {string} properties.name Subscription name, defaults to empty string
  * @param {string} properties.siteId Subscription site id, defaults to null
  * @param {string} properties.type Subscription type, defaults to empty string
  * @param {string[]} properties.deviceIds Array of device id's to include in subscription. Defaults to empty array
  * @param {string[]} properties.listIds Array of list id's to include in subscription. Defaults to empty array
  * @param {string[]} properties.siteIds Array of site id's to include in subscription. Defaults to empty array
  * @param {string[]} properties.userIds Array of user id's to include in subscription. Defaults to empty array
  * @param {string[]} properties.groupIds Array of group id's to include in subscription. Defaults to empty array
  * @param {string[]} properties.events Array of event types to include in subscription. Defaults to empty array, which is equal to all event types
  * @param {number} properties.startTime Time of day to start sending alerts. Defaults to 0.0
  * @param {number} properties.endTime Time of day to stop sending alerts. Defaults to 0.0
  * @param {boolean} properties.sunday True if we send alerts on Sundays. Defaults to false
  * @param {boolean} properties.monday True if we send alerts on Mondays. Defaults to false
  * @param {boolean} properties.tuesday True if we send alerts on Tuesdays. Defaults to false
  * @param {boolean} properties.wednesday True if we send alerts on Wednesdays. Defaults to false
  * @param {boolean} properties.thursday True if we send alerts on Thursdays. Defaults to false
  * @param {boolean} properties.friday True if we send alerts on Fridays. Defaults to false
  * @param {boolean} properties.saturday True if we send alerts on Saturdays. Defaults to false
  * @param {string} createdById User id preforming add operation, null if programmatic. Defaults to null
  * @returns Promise that returns an object on success, or null on error
  */
 const addRating = async ({name = '', siteId = null, type = '', deviceIds = [], listIds = [], siteIds = [], userIds = [], groupIds = [], events = [], 
     startTime = 0.0, endTime = 0.0, sunday = false, monday = false, tuesday = false, wednesday = false, thursday = false, friday = false, saturday = false, alertTypes = ['All']} = {}, createdById = null) => {
     // TODO check for if site id is valid and if site id is not null?
     // TODO check if device ids are valid? 
     // TODO check if user ids are valid? 
     // TODO check if group ids are valid? 
     // TODO check if list ids are valid?  
     // TODO check if site ids are valid?    
     // Create DB group
     let subscriptionRes = await database.entities.subscriptions.add({
         name: name, 
         siteId: siteId, 
         type: type,
         deviceIds: deviceIds,
         listIds: listIds,
         siteIds: siteIds,
         userIds: userIds,
         groupIds: groupIds,
         events: events,
         startTime: startTime,
         endTime: endTime,
         sunday: sunday,
         monday: monday,
         tuesday: tuesday,
         wednesday: wednesday,
         thursday: thursday,
         friday: friday,
         saturday: saturday,
         alertTypes: alertTypes
     }, createdById)
 
     // Check for DB error
     if (subscriptionRes === null) {
         logger.warn("Error creating DB subscription")
         return null
     }
 
     return {
         id: subscriptionRes.id
     }
 }
 
 /**
  * Edit subscription
  * @param {string} id Id of subscription object to edit
  * @param {object} properties Object of subscription properties to set
  * @param {string} properties.name Subscription name. Defaults to null which means it will not be updated
  * @param {string} properties.siteId Subscription site id. Defaults to null which means it will not be updated
  * @param {string} properties.type Subscription type. Defaults to null which means it will not be updated
  * @param {string[]} properties.deviceIds Array of device id's to include in subscription. Defaults to null which means it will not be updated
  * @param {string[]} properties.listIds Array of list id's to include in subscription. Defaults to null which means it will not be updated
  * @param {string[]} properties.siteIds Array of site id's to include in subscription. Defaults to null which means it will not be updated
  * @param {string[]} properties.userIds Array of user id's to include in subscription. Defaults to null which means it will not be updated
  * @param {string[]} properties.groupIds Array of group id's to include in subscription. Defaults to null which means it will not be updated
  * @param {string[]} properties.events Array of event types to include in subscription. Defaults to null which means it will not be updated
  * @param {number} properties.startTime Time of day to start sending alerts. Defaults to null which means it will not be updated
  * @param {number} properties.endTime Time of day to stop sending alerts. Defaults to null which means it will not be updated
  * @param {boolean} properties.sunday True if we send alerts on Sundays. Defaults to null which means it will not be updated
  * @param {boolean} properties.monday True if we send alerts on Mondays. Defaults to null which means it will not be updated
  * @param {boolean} properties.tuesday True if we send alerts on Tuesdays. Defaults to null which means it will not be updated
  * @param {boolean} properties.wednesday True if we send alerts on Wednesdays. Defaults to null which means it will not be updated
  * @param {boolean} properties.thursday True if we send alerts on Thursdays. Defaults to null which means it will not be updated
  * @param {boolean} properties.friday True if we send alerts on Fridays. Defaults to null which means it will not be updated
  * @param {boolean} properties.saturday True if we send alerts on Saturdays. Defaults to null which means it will not be updated
  * @param {boolean} properties.isActive True if subscription is enabled. Defaults to null which means it will not be updated
  * @param {string} editedById User id preforming edit operation, null if programmatic. Defaults to null
  * @returns Promise that returns true on success, or false on error
  */
 const editRating = async (id, {name = null, siteId = null, type = null, deviceIds = null, listIds = null, siteIds = null, userIds = null, groupIds = null, events = null, 
     startTime = null, endTime = null, sunday = null, monday = null, tuesday = null, wednesday = null, thursday = null, friday = null, saturday = null, isActive = null, alertTypes = null} = {}, editedById = null) => {
     // Update subscription
     let res = await database.entities.subscriptions.edit(id, {
         name: name, 
         siteId: siteId, 
         type: type,
         deviceIds: deviceIds,
         listIds: listIds,
         siteIds: siteIds,
         userIds: userIds,
         groupIds: groupIds,
         events: events,
         startTime: startTime,
         endTime: endTime,
         sunday: sunday,
         monday: monday,
         tuesday: tuesday,
         wednesday: wednesday,
         thursday: thursday,
         friday: friday,
         saturday: saturday,
         isActive: isActive, 
         alertTypes: alertTypes,
     }, editedById)
 
     // Check for database error
     if (res === null) {
         logger.warn('Edit subscription failed')
         return false
     }
     else {
         return true
     }
 }
 
 /**
  * Soft delete subscription
  * @param {string} id Id of subscription object to delete
  * @param {string} editedById User id preforming delete operation, null if programmatic. Defaults to null
  * @returns Promise that returns true on success, or false on error
  */
 const deleteRating = async (id, editedById = null) => {
     let res = await database.entities.subscriptions.delete(id, editedById)
 
     // Check for error
     if (res !== null) {
         return true
     }
     else {
         return false
     }
 }
 
 module.exports = {
    getRating, addRating, editRating, deleteRating
 }