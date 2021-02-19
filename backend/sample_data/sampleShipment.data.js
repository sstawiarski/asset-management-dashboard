const sampleShipment = [
    {
        "createdBy": "Test 1",
        "created": Date.now(),
        "updated": Date.now(),
        "completed": Date.now(),
        "status": "Staging",
        "shipmentType": "Incoming",
        "specialInstructions": "seriously, don't lose this",
        "contractId": "345678",
        "manifest": [
            {
                "item": "X800-87650",
                "type": "Crossover Sub",
                "quantity": 1,
                "notes": "just testing this beast out!",
                "serialized": true
            },
            {
                "item": "box of boxes of batteries",
                "type": "batteries",
                "quantity": 1500,
                "notes": "keep batteries in individual cases!  fire hazard!  there's a lot of 'em!",
                "serialized": false
            }
        ],
        "key": "SHIP-100"
    }
];

module.exports = sampleShipment;