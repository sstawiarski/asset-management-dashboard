const assetPaths = {
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
    }

module.exports = assetPaths;