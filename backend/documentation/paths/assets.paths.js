const assetPaths = {
    'root': {
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
    }
}

module.exports = assetPaths;