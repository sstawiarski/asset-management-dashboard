const assetsPaths = require('./assets.paths')

const paths = {
    '/assets': assetsPaths.getAllAssets,
    '/assets/findBySerial': assetsPaths.findBySerial
}

module.exports = paths;