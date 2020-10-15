const assetPaths = {
    getAllAssets: {
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
                    description: 'No assets found',
                    schema: {
                        $ref: '#/components/schemas/Error'
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