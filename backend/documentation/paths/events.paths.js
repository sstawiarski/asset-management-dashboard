const eventsPath = {
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
    },
    findEventsForSerial: {
        get: {
            tags: ['Events'],
            description: 'Find the events associated with an asset by serial number',
            operationId: 'findEventsForSerial',
            parameters: [{
                name: 'serial',
                in: 'path',
                schema: {
                    $ref: '#/components/schemas/serial'
                },
                required: true
            }],
            responses: {
                '200': {
                    description: 'All related events associated with the serial number provided',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#components/schemas/Events'
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
                    description: 'No matching events found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'No events found for serial',
                                internalCode: 'no_events_found'
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = eventsPath;
