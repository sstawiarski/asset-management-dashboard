const assetPaths = {
    getAllAssets: {
        get: {
            tags: ['Assets'],
            description: 'Get a document containing all assets in the database',
            operationId: 'getAllAssets',
            parameters: [],
            responses: {
                '200': {
                    description: 'Assets were found in the database',
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
                    in: 'query',
                    schema: {
                        $ref: '#/components/schemas/serial'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'Up to 5 fuzzy-matched assets were obtained',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Assets'
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
                    description: 'No matching assets fount',
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