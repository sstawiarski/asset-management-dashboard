const sampleEvents = [
    {
        "productIds": [
            "G800-1111",
            "C800-1011"
        ],
        "key": "SHIP-1010",
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
                    "serial": "G800-1111",
                    "type": "Asset",
                    "quantity": 1,
                    "notes": ""
                },
                {
                    "serial": "C800-1011",
                    "type": "Asset",
                    "quantity": 1,
                    "notes": ""
                }
            ]
        }
    },
    {
        "productIds": [
            "G800-1111",
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
            "X800-920"
        ],
        "key": "REA-98",
        "eventType": "Reassignment",
        "eventData": {
            "authorizor": "Jane Doe",
            "newAssignee": "Drillco",
            "oldAssignee": "Supply Chain USA"
        }
    }
];

module.exports = sampleEvents;