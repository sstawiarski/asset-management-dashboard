const schemas = {
    searchFilter:{
        type: 'string',
        example: 'assetType + dateCreated',
        description: 'Concatenates search queries based on filtered input'
    },
    serial: {
        type: 'string',
        example: 'ELP-9001'
    },
    searchSerial: {
        type: 'string',
        example: 'ELP9001',
        description: 'Serial without dashes for use with search'
    },
    sort_by: {
        type: 'string',
        example: 'dateCreated'
    },
    order: {
        type: 'string',
        example: 'desc'
    },
    assetType: {
        type: 'string',
        example: 'Carrier'
    },
    deployedLocation: {
        type: 'string',
        example: 'Calgary, AB'
    },
    owner: {
        type: 'string'
    },
    parentId: {
        type: 'string',
        description: 'The ObjectId of the parent assembly if applicable'
    },
    dateCreated: {
        type: 'string'
    },
    lastUpdated: {
        type: 'string'
    },
    checkedOut: {
        type: 'boolean',
        description: 'Whether or not the asset is checked out'
    },
    groupTag: {
        type: 'string',
        example: 'Customer-Rental-Pool-B'
    },
    assignee: {
        type: 'string',
        description: 'Customer who is assigned the asset'
    },
    assignmentType: {
        type: 'string',
        description: 'Whether asset is owned or rented by assigned person',
        enum: ['Owned', 'Rented']
    },
    contactNumber: {
        type: 'string',
        description: 'The contract number to which an asset belongs'
    },
    retired: {
        type: 'boolean',
        description: 'Whether or not the asset is currently retired from service'
    },
    Asset: {
        type: 'object',
        properties: {
            serial: {
                $ref: '#/components/schemas/serial'
            },
            assetType: {
                $ref: '#/components/schemas/assetType'
            },
            deployedLocation: {
                $ref: '#/components/schemas/deployedLocation'
            },
            owner: {
                $ref: '#/components/schemas/owner'
            },
            parentId: {
                $ref: '#/components/schemas/parentId'
            },
            dateCreated: {
                $ref: '#/components/schemas/dateCreated'
            },
            lastUpdated: {
                $ref: '#/components/schemas/lastUpdated'
            },
            checkedOut: {
                $ref: '#/components/schemas/checkedOut'
            },
            groupTag: {
                $ref: '#/components/schemas/groupTag'
            },
            assignee: {
                $ref: '#/components/schemas/assignee'
            },
            assignmentType: {
                $ref: '#/components/schemas/assignmentType'
            },
            contactNumber: {
                $ref: '#/components/schemas/contactNumber'
            },
            retired: {
                $ref: '#/components/schemas/retired'
            },
        }
    },
    Assets: {
        type: 'array',
        items: {
            $ref: '#/components/schemas/Asset'
        }
    },

    client: {
        type: 'string',
        description: 'Plaintext client name',
        example: 'Blackhawk Energy'
    },
    operator: {
        type: 'string',
        description: 'Plaintext operator name',
        example: 'Nabors Drilling'
    },
    rigName: {
        type: 'string',
        description: 'The name of the rig'
    },
    contactName: {
        type: 'string',
        description: 'First and last name of the rig contact'
    },
    contactNumber: {
        type: 'string',
        description: 'Telephone number of the rig contact'
    },
    Rig: {
        type: 'object',
        description: 'Data for a single Rig document',
        properties: {
            client: {
                $ref: '#/components/schemas/client'
            },
            operator: {
                $ref: '#/components/schemas/operator'
            },
            rigName: {
                $ref: '#/components/schemas/rigName'
            },
            contactName: {
                $ref: '#/components/schemas/contactName'
            },
            contactNumber: {
                $ref: '#/components/schemas/contactNumber'
            }
        }
    },
    Rigs: {
        type: 'array',
        decription: 'Multiple rig documents in an array',
        items: {
            $ref: '#/components/schemas/Rig'
        }
    },

    facilityName: {
        type: 'string',
        description: 'Name of the facility',
        example: 'Nabors TX Yard'
    },
    StagingFacility: {
        type: 'object',
        description: 'Document of a single staging facility',
        properties: {
            facilityName: {
                $ref: '#/components/schemas/facilityName'
            },
            operator: {
                $ref: '#/components/schemas/operator'
            },
            rigName: {
                $ref: '#/components/schemas/rigName'
            },
            contactName: {
                $ref: '#/components/schemas/contactName'
            },
            contactNumber: {
                $ref: '#/components/schemas/contactNumber'
            }
        }
    },
    StagingFacilities: {
        type: 'array',
        items: {
            $ref: '#/components/schemas/StagingFacility'
        }
    },

    address: {
        type: 'string',
        description: 'Address string representing only the first line of an address',
        example: '123 Fake Street'
    },
    city: {
        type:'string'
    },
    state: {
        type: 'string'
    },
    zip: {
        type: 'string'
    },
    RepairFacility: {
        type: 'object',
        description: 'Document for a single repair facility',
        properties: {
            facilityName: {
                $ref: '#/components/schemas/facilityName'
            },
            address: {
                $ref: '#/components/schemas/address'
            },
            city: {
                $ref: '#/components/schemas/city'
            },
            state: {
                $ref: '#/components/schemas/state'
            },
            zip: {
                $ref: '#/components/schemas/zip'
            },
            contactName: {
                $ref: '#/components/schemas/contactName'
            },
            contactNumber: {
                $ref: '#/components/schemas/contactNumber'
            }
        }
    },
    RepairFacilities: {
        type: 'array',
        description: 'Array of repair facility documents',
        items: {
            $ref: '#/components/schemas/RepairFacility'
        }
    },

    Error: {
        type: 'object',
        properties: {
            message: {
                type: 'string'
            },
            internalCode: {
                type: 'string'
            }
        }
    },
    productIds: {
        type: 'array',
        items: {
            $ref: '#/components/schemas/serial'
        }
    },
    key: {
        type: 'string',
        example: 'OWN909'
    },
    eventType: {
        type: 'string',
        enum: [
            'Incoming Shipment',
            'Outgoing Shipment',
            'Change of Ownership',
            'Change of Group Tag',
            'Change of Retirement Status',
            'Change of Assignment Type',
            'Reassignment'
        ],
        example: 'Incoming Shipment'
    },
    eventData: {
        type: 'object'
    },
    eventTime: {
        type: 'string',
        description: 'Date the event occurred'
    },
    Event: {
        type: 'object',
        properties: {
            productIds: {
                $ref: '#/components/schemas/productIds'
            },
            key: {
                $ref: '#/components/schemas/key'
            },
            eventType: {
                $ref: '#/components/schemas/eventType'
            },
            eventData: {
                $ref: '#/components/schemas/eventData'
            },
            eventTime: {
                $ref: '#/components/schemas/eventTime'
            },
        }
    },
    Events: {
        type: 'array',
        items: {
            $ref: '#/components/schemas/Event'
        }
    },

    serialList: {
        type: 'array',
        items: {
            $ref: '#/components/schemas/serial'
        }
    },
}

module.exports = schemas;