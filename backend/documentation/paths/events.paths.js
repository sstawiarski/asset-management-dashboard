const eventPaths = {
    'root': {

    },
    'load': {
        put: {
            tags: ['Events'],
            description: 'Load sample event data from file into database',
            operationId: 'loadEvents',
            parameters: [],
            responses: {
                '200': {
                    description: 'Event sample data was successfully loaded into the database',
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

module.exports = eventPaths;