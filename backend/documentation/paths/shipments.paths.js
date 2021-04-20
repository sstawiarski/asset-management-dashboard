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
        get: {
            tags: ['Shipments'],
            description: 'Find shipments stored in the DB',
            operationId: 'getAllShipments',
            parameters: [
                
                    
            ],
            responses: {
                '200': {
                    description: 'A single matching asset to the key path parameter',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Shipment'
                            }
                        }
                    }
                },
                '400': {
                    description: 'Missing parameters',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'key is missing',
                                internalCode: 'missing_parameters'
                            }
                        }
                    }
                },
                '404': {
                    description: 'No matching shipments found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'No shipment found for key',
                                internalCode: 'no_assets_found'
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: ['Shipments'],
            description: 'Create new shipment',
            operationId: 'createShipment',
            parameters: [
                {
                    name: 'key',
                    in: 'body',
                    schema: {
                        type: 'string',
                        items: {
                            $ref: '#/components/schemas/key'
                        }
                    },
                    required: false
                },

                {
                    name: 'createdBy',
                    in: 'body',
                    schema: {
                        type: 'string',
                        items: {
                            $ref: '#/components/schemas/createdBy'
                        }
                   },
                    required: false

                },

                {
                    name: 'created',
                    in: 'body',
                    schema: {
                        type: 'date',
                        },
                    required: true
                },
                {
                    name: 'updated',
                    in: 'body',
                    schema: {
                        type: 'date',
                        },
                    required: true
                },
                {
                    name: 'completed',
                    in: 'body',
                    schema: {
                        type: 'date',
                        },
                    required: true
                },
                {
                    name: 'status',
                    in: 'body',
                    schema: {
                        type: 'string',
                        enum: ['Staging', 'Completed', 'Abandoned'],
                    },
                    required: true
                },
                {
                    name: 'shipmentType',
                    in: 'body',
                    schema: {
                        type: 'string',
                        enum: ['Incoming', 'Outgoing'],
                    },
                    required: true
                },
                {
                    name: 'shipFrom',
                    in: 'body',
                    schema: {
                        type: 'object',
                        },
                    required: true
                },

                {
                    name: 'shipTo',
                    in: 'body',
                    schema: {
                        type: 'object',
                        },
                    required: false
                },

                {
                    name: 'specialInstructions',
                    in: 'body',
                    schema: {
                        type: 'string',
                    },
                    required: false
                },
                {
                    name: 'contractId',
                    in: 'body',
                    schema: {
                        type: 'string'
                    },
                    required: false
                }
            ],
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
                '403': {
                    description: 'Required parameters missing',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '500': {
                    description: 'Internal server error',
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
    },
    findByKey: {
        get: {
            tags: ['Shipments'],
            description: 'Find a single shipment based on the key provided',
            operationId: 'findByKey',
            parameters: [
                {
                    name: 'key',
                    in: 'path',
                    schema: {
                        $ref: '#/components/schemas/key'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'A single matching asset to the key path parameter',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Shipment'
                            }
                        }
                    }
                },
                '400': {
                    description: 'Missing parameters',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'key is missing',
                                internalCode: 'missing_parameters'
                            }
                        }
                    }
                },
                '404': {
                    description: 'No matching shipments found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'No shipment found for key',
                                internalCode: 'no_assets_found'
                            }
                        }
                    }
                }
            }
        },
        patch: {
            tags: ['Shipments'],
            description: "Updates fields in shipments based on key (and children if applicable) and generate event object",
            operationId: "updateShipmentField",
            parameters: [
                {
                    name: 'key',
                    in: 'body',
                    schema: {
                        $ref: '#components/schemas/key'
                    },
                    required: true,
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
    }

}

module.exports = shipmentPaths;