const assetsPaths = require('./assets.paths')
const eventsPaths = require('./events.paths')

const paths = {
    '/assets': assetsPaths.getAllAssets,
    '/assets/findBySerial': assetsPaths.findBySerial,
    '/events/findEventsForSerial': eventsPaths.findEventsForSerial
}

module.exports = paths;