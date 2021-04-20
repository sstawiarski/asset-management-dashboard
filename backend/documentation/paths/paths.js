const assetsPaths = require('./assets.paths')
const eventsPaths = require('./events.paths')
const customerPaths = require('./customers.paths')
const employeePaths = require('./employees.paths')
const locationPaths = require('./locations.paths')
const authPaths = require('./auth.paths');
const shipmentPaths = require('./shipments.paths');
const attachmentPaths = require('./attachments.paths');

const paths = {
    '/assets': assetsPaths.root,
    '/assets/load': assetsPaths.load,
    '/assets/:serial': assetsPaths.findBySerial,
    '/assets/:searchFilter': assetsPaths.findByFilter,
    '/assets/assembly/schema': assetsPaths["assembly/schema"],
    '/assets/assembly': assetsPaths["assembly"],

    '/shipments': shipmentPaths.root,
    
    '/events': eventsPaths.root,
    '/events/load': eventsPaths.load,
    '/events/:serial': eventsPaths.findEventsForSerial,
    'events/:sort_by': eventsPaths.sort_by,
    '/events/:order': eventsPaths.order,

    '/customers': customerPaths.root,
    '/customers/load': customerPaths.load,

    '/employees/load': employeePaths.load,
    '/employees/:employeeId': employeePaths.getById,

    '/locations': locationPaths.root,
    '/locations/load': locationPaths.load,

    '/auth/login': authPaths.login,

    '/shipments': shipmentPaths.root,
    '/shipments/load': shipmentPaths.load,
    '/shipments/:key': shipmentPaths.findByKey,

    '/attachments/:name': attachmentPaths.getByName,
    '/attachments/shipment/:key': attachmentPaths.postToKey,
    '/attachments/:uuid': attachmentPaths.deleteByUUID,
    '/attachments/shipment/:key': attachmentPaths.getForShipment
}

module.exports = paths;