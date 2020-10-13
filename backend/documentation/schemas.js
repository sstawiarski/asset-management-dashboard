const schemas = {
    serial: {
        type: 'string',
        example: 'ELP-9001'
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
        type: 'object',
        properties: {
            assets: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Asset'
                }
            }
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
    }
}

module.exports = schemas;