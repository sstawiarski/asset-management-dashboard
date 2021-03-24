const sampleShipment = [
    {
        "createdBy": "Test 1",
        "created": Date.now(),
        "updated": Date.now(),
        "completed": Date.now(),
        "status": "Abandoned",
        "shipmentType": "Incoming",
        "specialInstructions": "seriously, don't lose this",
        "contractId": "345678",
        "manifest": [
            {
                "serial": "X800-87650",
                "name": "Crossover Sub",
                "quantity": 1,
                "notes": "just testing this beast out!",
                "serialized": true
            },
            {
                "serial": "box of boxes of batteries",
                "name": "batteries",
                "quantity": 1500,
                "notes": "keep batteries in individual cases!  fire hazard!  there's a lot of 'em!",
                "serialized": false
            }
        ],
        "key": "SHIP-100",
        "shipFromOverride": {
            "contactName": "Jason DeRulo",
            "contactNumber": "1-800-867-5309"
        },
        "shipFrom": "",
        "shipTo": ""
    },
    {
        "createdBy": "Test 2",
        "created": Date.now(),
        "updated": Date.now(),
        "completed": Date.now(),
        "status": "Staging",
        "shipmentType": "Incoming",
        "specialInstructions": "seriously, don't lose this",
        "contractId": "345678",
        "manifest": [
            {
                "serial": "X800-87650",
                "name": "Crossover Sub",
                "quantity": 1,
                "notes": "just testing this beast out!",
                "serialized": true
            },
            {
                "serial": "box of boxes of batteries",
                "name": "batteries",
                "quantity": 1500,
                "notes": "keep batteries in individual cases!  fire hazard!  there's a lot of 'em!",
                "serialized": false
            }
        ],
        "key": "SHIP-101",
        "shipToOverride": {
            "contactName": "TESTING 1 2 1 2"
        },
        "shipFrom": "",
        "shipTo": ""
    },
    {
        "createdBy": "Test 3",
        "created": Date.now(),
        "updated": Date.now(),
        "completed": Date.now(),
        "status": "Completed",
        "shipmentType": "Incoming",
        "specialInstructions": "seriously, don't lose this",
        "contractId": "345678",
        "manifest": [
            {
                "serial": "X800-87650",
                "name": "Crossover Sub",
                "quantity": 1,
                "notes": "just testing this beast out!",
                "serialized": true
            },
            {
                "serial": "box of boxes of batteries",
                "name": "batteries",
                "quantity": 1500,
                "notes": "keep batteries in individual cases!  fire hazard!  there's a lot of 'em!",
                "serialized": false
            }
        ],
        "key": "SHIP-102",
        "shipFrom": "",
        "shipTo": ""
    },
    { 
        "createdBy": "Test 4",
        "created": Date.now(),
        "updated": Date.now(),
        "completed": Date.now(),
        "status": "Staging",
        "shipmentType": "Incoming",
        "specialInstructions": "seriously, don't lose this",
        "contractId": "345678",
        "manifest": [
            {
                "serial": "X800-87650",
                "name": "Crossover Sub",
                "quantity": 1,
                "notes": "just testing this beast out!",
                "serialized": true
            },
            {
                "serial": "box of boxes of batteries",
                "name": "batteries",
                "quantity": 1500,
                "notes": "keep batteries in individual cases!  fire hazard!  there's a lot of 'em!",
                "serialized": false
            }
        ],
        "key": "SHIP-103",
        "shipFrom": "",
        "shipTo": ""
    },
    {
        "createdBy": "Test 5",
        "created": Date.now(),
        "updated": Date.now(),
        "completed": Date.now(),
        "status": "Staging",
        "shipmentType": "Incoming",
        "specialInstructions": "seriously, don't lose this",
        "contractId": "345678",
        "manifest": [
            {
                "serial": "X800-87650",
                "name": "Crossover Sub",
                "quantity": 1,
                "notes": "just testing this beast out!",
                "serialized": true
            },
            {
                "serial": "box of boxes of batteries",
                "name": "batteries",
                "quantity": 1500,
                "notes": "keep batteries in individual cases!  fire hazard!  there's a lot of 'em!",
                "serialized": false
            }
        ],
        "key": "SHIP-104",
        "shipFrom": "",
        "shipTo": ""
    },
    {
        "createdBy": "Test 6",
        "created": Date.now(),
        "updated": Date.now(),
        "completed": Date.now(),
        "status": "Staging",
        "shipmentType": "Incoming",
        "specialInstructions": "seriously, don't lose this",
        "contractId": "345678",
        "manifest": [
            {
                "serial": "X800-87650",
                "name": "Crossover Sub",
                "quantity": 1,
                "notes": "just testing this beast out!",
                "serialized": true
            },
            {
                "serial": "box of boxes of batteries",
                "name": "batteries",
                "quantity": 1500,
                "notes": "keep batteries in individual cases!  fire hazard!  there's a lot of 'em!",
                "serialized": false
            }
        ],
        "key": "SHIP-105",
        "shipFrom": "",
        "shipTo": ""
    }

];

module.exports = sampleShipment;