const assetPaths = {
    'root': {
        get: {
            tags: ['Assets'],
            description: 'Get a document containing all assets in the database',
            operationId: 'getAllAssets',
            parameters: [
                {
                    name: 'search',
                    in: 'query',
                    schema: {
                        $ref: '#/components/schemas/searchSerial'
                    }
                }
            ],
            responses: {
                '200': {
                    description: 'All assets were found in the database',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Assets'
                            }
                        }
                    }
                },
                '201': {
                    description: 'Assets were found in the database matching the fuzzy search string',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Assets'
                            }
                        }
                    }
                },
                '400': {
                    description: 'No assets founds',
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
        patch: {
            tags: ['Assets'],
            description: "Updates fields in asset(s) (and children if applicable)",
            operationId: "updateField",
            parameters: [
                {
                    name: 'assets',
                    in: 'body',
                    schema: {
                        $ref: '#/components/schemas/serialList'
                    },
                    required: true,
                    description: "Array of asset serials (must always be array even if only 1 serial)"
                },
                {
                    name: 'field',
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
                }
            ],
            responses: {
                '200': {
                    description: 'Successfully updated assets',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Updated 2 regular assets, 2 assemblies, and 3 of their children."
                                    }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error updating assets',
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
    'load': {
        put: {
            tags: ['Assets'],
            description: 'Load sample asset data from file into database',
            operationId: 'loadAssets',
            parameters: [],
            responses: {
                '200': {
                    description: 'Assets were successfully loaded into the database',
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
    findBySerial: {
        get: {
            tags: ['Assets'],
            description: 'Find an array of up to 5 assets based on the serial provided',
            operationId: 'findBySerial',
            parameters: [
                {
                    name: 'serial',
                    in: 'path',
                    schema: {
                        $ref: '#/components/schemas/serial'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'A single matching asset to the serial path parameter',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Asset'
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
                                message: 'serial is missing',
                                internalCode: 'missing_parameters'
                            }
                        }
                    }
                },
                '500': {
                    description: 'No matching assets found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'No assets found for serial',
                                internalCode: 'no_assets_found'
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = assetPaths;