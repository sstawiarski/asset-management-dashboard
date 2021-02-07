const sampleManifest = require('./sampleManifest.data');

const sampleShipment = [
    {
        "createdBy":"Joe Dirt",
        "created": '2020-01-31',
        "updated": '2020-01-31',
        "completed": '2020-01-31',
        "status": "Staging",
        "shipmentType": "Incoming",
        "shipFrom": "Houston",
        "shipTo": "Calgary",
        "specialInstructions":"none",
        "contractId":"345678",
        "manifest": sampleManifest,
    }
];

module.exports = sampleShipment;