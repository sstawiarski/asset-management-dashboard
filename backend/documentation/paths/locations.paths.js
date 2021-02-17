const locationPaths = {
    'root': {
        get: {
            tags: ['Locations'],
            description: 'Get all locations of a specific type or in general',
            operationId: 'getLocations',
            parameters: [
                {
                    name: "type",
                    in: "query",
                    schema: {
                        type: "string",
                        description: "Either Rig, Staging Facility, or Repair Facility to define which locations to find (URI encoded)",
                        example: 'Rig'
                    }
                }
            ],
            responses: {
                '200': {
                    description: 'Successfully retrieved location data',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Locations'
                            }
                        }
                    }
                },
                '400': {
                    description: 'Invalid location type specifier provided in query',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '404': {
                    description: 'No location documents found for specified type',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error retrieving location data',
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
            tags: ['Locations'],
            description: 'Load sample event data from file into database',
            operationId: 'loadLocations',
            parameters: [],
            responses: {
                '200': {
                    description: 'Location sample data was successfully loaded into the database',
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

module.exports = locationPaths;