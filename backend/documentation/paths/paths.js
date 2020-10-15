const assetsPaths = require('./assets.paths')
const eventsPaths = require('./events.paths')

const paths = {
    '/assets': assetsPaths.getAllAssets,
    '/assets/:serial': assetsPaths.findBySerial,
    
    '/events/:serial': eventsPaths.findEventsForSerial
}

module.exports = paths;