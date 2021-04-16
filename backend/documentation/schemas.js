const schemas = {
    searchFilter: {
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
    contractNumber: {
        type: 'string',
        description: 'The contract number to which an asset belongs'
    },
    retired: {
        type: 'boolean',
        description: 'Whether or not the asset is currently retired from service'
    },
    created: {
        type: 'date',
        description: 'Date entry'
    },
    updated: {
        type: 'date',
        description: 'Date entry'
    },
    completed: {
        type: 'date',
        description: 'Date entry'
    },
    status: {
        type: 'string',
        enum: ['Staging', 'Completed', 'Abandoned']
    },
    shipmentType: {
        type: 'string',
        enum: ['Incoming', 'Outgoing']
    },
    shipFrom:{
        type: 'object',
        
    },
    shipTo: {
        type: 'object'
    },
    specialInstructions: {
        type: 'string',
        description: 'Special instructions for a shipment',
        example: 'Batteries: Handle with care'
    },
    contractId: {
        type: 'string'
    },
    name: {
        type: 'string',
        description: 'Asset name on manifest'
    },
    quantity: {
        type: 'number'
    },
    notes: {
        type: 'string'
    },
    serialized: {
        type: 'boolean'
    },
    Manifest: {
        type: 'object',
        properties: {
            serial: {
                $ref: '#components/schemas/serial'
            },
            name: {
                $ref: '#components/schemas/name'

            },
            quantity: {
                $ref: '#components/schemas/quantity'

            },
            notes: {
                $ref: '#components/schemas/notes'

            },
            serialized: {
                $ref: '#components/schemas/serialized'

            }
        }
    },
    Shipment: {
        type: 'object',
        properties: {
            key:{
                $ref: '#components/schemas/key'
            },
            createdBy: {
                $ref: '#components/schemas/createdBy'
            },
            created: {
                $ref: '#components/schemas/created'
            },
            updated: {
                $ref: '#components/schemas/updated'

            },
            completed: {
                $ref: '#components/schemas/completed'

            },
            status: {
                $ref: '#components/schemas/status'
            },
            shipmentType: {
                $ref: '#components/schemas/shipmentType'
            },
            shipFrom:{
                $ref: '#components/schemas/shipFrom'
            },
            shipTo: {
                $ref: '#components/schemas/shipTo'

            },
            specialInstructions: {
                $ref: '#components/schemas/specialInstructions'

            },
            contractId: {
                $ref: '#components/schemas/contractId'

            },
            
            manifest: {
                $ref: '#components/schemas/Manifest'

            }
        }
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
            contractNumber: {
                $ref: '#/components/schemas/contractNumber'
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
    createdBy: {
        type: 'string',
        description: 'User name of document originiator',
        example: 'JSmith'
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

    facilityName: {
        type: 'string',
        description: 'Name of the facility',
        example: 'Nabors TX Yard'
    },

    address: {
        type: 'string',
        description: 'Address string representing only the first line of an address',
        example: '123 Fake Street'
    },
    city: {
        type: 'string'
    },
    state: {
        type: 'string'
    },
    zip: {
        type: 'string'
    },

    Location: {
        type: 'object',
        description: 'Document for a single physical location (possible Rig, Staging Facility, or Repair Facility)',
        properties: {
            key: {
                type: "string",
                description: "A unique location key",
                example: "NABORS-TX"
            },
            locationName: {
                $ref: '#/components/schemas/facilityName'
            },
            locationType: {
                type: "string",
                enum: ["Repair Facility", "Staging Facility", "Rig"]
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
            },
            rigName: {
                $ref: '#/components/schemas/rigName'
            },
            operator: {
                $ref: '#/components/schemas/operator'
            },
            client: {
                $ref: '#/components/schemas/client'
            },
            coordinates: {
                type: "object",
                properties: {
                    latitude: {
                        type: "number"
                    },
                    longitude: {
                        type: "number"
                    }
                }
            }
        }
    },

    Locations: {
        type: "array",
        items: {
            $ref: '#/components/schemas/Location'
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

    companyName: {
        type: 'string',
        description: 'Name of a company'
    },

    customerId: {
        type: 'number',
        description: 'Unique customer identification number'
    },

    firstName: {
        type: 'string',
        description: 'Customer first name'
    },

    lastName: {
        type: 'string',
        description: 'Customer last name'
    },

    addressLine1: {
        type: 'string',
        description: 'First line of an address in plaintext'
    },

    addressLine2: {
        type: 'string',
        description: 'Second line of an address in plaintext; for postal codes, suite numbers, etc'
    },

    Customer: {
        type: 'object',
        description: 'Document of a single customer',
        properties: {
            customerId: {
                $ref: '#/components/schemas/customerId'
            },
            firstName: {
                $ref: '#/components/schemas/firstName'
            },
            lastName: {
                $ref: '#/components/schemas/lastName'
            },
            companyName: {
                $ref: '#/components/schemas/companyName'
            },
            addressLine1: {
                $ref: '#/components/schemas/addressLine1'
            },
            addressLine2: {
                $ref: '#/components/schemas/addressLine2'
            },
            city: {
                $ref: '#/components/schemas/city'
            },
            state: {
                $ref: '#/components/schemas/state'
            },
            zip: {
                $ref: '#/components/schemas/zip'
            }
        }
    },

    Customers: {
        type: 'array',
        items: {
            $ref: '#/components/schemas/Customer'
        }
    },

    userInfo: {
        type: 'object',
        description: 'User information',
        properties: {
            firstName: {
                type: 'string',
                description: 'User first name on file'
            },
            lastName: {
                type: 'string',
                description: 'User last name on file'
            },
            uniqueId: {
                type: 'object',
                description: 'Encrypted, uniquely identifying user information',
                properties: {
                    iv: {
                        type: 'string'
                    },
                    content: {
                        type: 'string'
                    }
                }
            }
        }
    },
    attachment: {
        type: 'object',
        description: 'A file attachment',
        properties: {
            _id: {
                type: 'string'
            },
            uuid: {
                type: 'string',
                description: 'A unique ID'
            },
            filename: {
                type: 'string',
                description: 'The "pretty" filename; the file\'s original name'
            },
            link: {
                type: 'string',
                description: 'The file\'s local name'
            },
            fileType: {
                type: 'string',
                description: 'The file\'s extension'
            },
            user: {
                type: 'string',
                description: 'The first and last name of the user who uploaded the attachment'
            },
            dateAdded: {
                type: 'string',
                description: 'The date the attachment was uploaded'
            }
        }
    },
    attachments: {
        type: 'array',
        items: {
            $ref: '#/components/schemas/attachment'
        }
    }
}

module.exports = schemas;