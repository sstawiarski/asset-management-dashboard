const eventsPath = {
    findEventsForSerial: {
        get: {
            tags: ['Events'],
            description: 'Find the events associated with an asset by serial number',
            operationId: 'findEventsForSerial',
            parameters: [{
                name: 'serial',
                in: 'query',
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