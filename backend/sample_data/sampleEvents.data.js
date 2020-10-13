const sampleEvents = [
    {
        "productIds": [
            "G8001111",
            "C8001011"
        ],
        "key": "SHIP1010",
        "eventType": "Outgoing Shipment",
        "eventData": {
            "status": "Staging",
            "shipmentType": "Outgoing",
            "shipFrom": {
                "origin": "Evolution Calgary",
            },
            "shipTo": {
                "destination": "Nabors Rig 1212",
            },
            "specialInstructions": "",
            "contractId": "123456",
            "manifest": [
                {
                    "serial": "G8001111",
                    "type": "Asset",
                    "quantity": 1,
                    "notes": ""
                },
                {
                    "serial": "C8001011",
                    "type": "Asset",
                    "quantity": 1,
                    "notes": ""
                }
            ]
        }
    },
    {
        "productIds": [
            "G8001111",
        ],
        "key": "OWN-909",
        "eventType": "Change of Ownership",
        "eventData": {
            "authorizer": "John Smith",
            "newOwner": "Evolution-Canada",
            "oldOwner": "Supply Chain USA"
        }
    },
    {
        "productIds": [
            "X800920"
        ],
        "key": "REA98",
        "eventType": "Reassignment",
        "eventData": {
            "authorizor": "Jane Doe",
            "newAssignee": "Drillco",
            "oldAssignee": "Supply Chain USA"
        }
    }
];

module.exports = sampleEvents;