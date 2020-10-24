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
    findByFilter: {
        get: {
            tags: ['Assets'],
            description: 'Find an array of up to 5 assets based on the filter input',
            operationId: 'findByFilter',
            parameters: [
                {
                    name: 'searchFilter',
                    in: 'path',
                    schema: {
                        $ref: '#/components/schemas/searchFilter'
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