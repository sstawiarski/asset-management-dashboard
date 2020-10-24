const assetsPaths = require('./assets.paths')
<<<<<<< HEAD
const customerPaths = require('./customers.paths')
const employeePaths = require('./employees.paths')
const eventPaths = require('./events.paths')
const locationPaths = require('./locations.paths')
const paths = {
    '/assets': assetsPaths.root,
    '/assets/load': assetsPaths.load,
=======
const eventsPaths = require('./events.paths')
const customerPaths = require('./customers.paths')
const employeePaths = require('./employees.paths')
const locationPaths = require('./locations.paths')

const paths = {
    '/assets': assetsPaths.root,
    '/assets/load': assetsPaths.load,
    '/assets/:serial': assetsPaths.findBySerial,
    '/assets/:searchFilter': assetsPaths.findByFilter,
    
    '/events': eventsPaths.root,
    '/events/load': eventsPaths.load,
    '/events/:serial': eventsPaths.findEventsForSerial,
>>>>>>> development

    '/customers/load': customerPaths.load,

    '/employees/load': employeePaths.load,

<<<<<<< HEAD
    '/events/load': eventPaths.load,

=======
>>>>>>> development
    '/locations': locationPaths.root,
    '/locations/load': locationPaths.load,

}

module.exports = paths;