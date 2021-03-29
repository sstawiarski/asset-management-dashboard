const shipmentPaths = {
    'root': {
        patch: {
            tags: ['Shipments'],
            description: "Updates fields in shipments(s) (and children if applicable) and generate event object",
            operationId: "updateShipmentField",
            parameters: [
                {
                    name: 'shipments',
                    in: 'body',
                    schema: {
                        type: "array",
                        items: {
                            type: "string",
                            description: "Shipment key",
                            example: "SHIP-100"
                        }
                    },
                    required: true,
                    description: "Array of shipment keys (must always be array even if only 1 key)"
                },
                {
                    name: 'update',
                    in: 'body',
                    schema: {
                        type: 'object',
                        properties: {
                            insertFieldNameHere: {
                                example: "[insert new value here]"
                            }
                        }
                    },
                    description: "Object containing the MongoDB field name as a property and the new value as its value",
                    required: true
                },
                {
                    name: 'user',
                    in: 'body',
                    schema: {
                        type: 'string'
                    },
                    description: 'Encrypted user id information',
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'Successfully updated shipments',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Shipment(s) successfully updated"
                                    }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error updating shipment(s)',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        },

    },
    'load': {
        put: {
            tags: ['Shipments'],
            description: 'Load sample shipment data from file into database',
            operationId: 'loadShipments',
            parameters: [],
            responses: {
                '200': {
                    description: 'Shipments were successfully loaded into the database',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error loading sample data into database',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = shipmentPaths;