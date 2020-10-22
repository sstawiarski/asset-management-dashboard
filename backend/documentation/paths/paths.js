const assetsPaths = require('./assets.paths')
const customerPaths = require('./customers.paths')
const employeePaths = require('./employees.paths')
const eventPaths = require('./events.paths')
const locationPaths = require('./locations.paths')
const paths = {
    '/assets': assetsPaths.root,
    '/assets/load': assetsPaths.load,

    '/customers/load': customerPaths.load,

    '/employees/load': employeePaths.load,

    '/events/load': eventPaths.load,

    '/locations': locationPaths.root,
    '/locations/load': locationPaths.load,

}

module.exports = paths;