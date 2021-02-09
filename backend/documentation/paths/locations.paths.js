const locationPaths = {
    'root': {
        get: {
            tags: ['Locations'],
            description: 'Get all locations of a specific type',
            operationId: 'getLocations',
            parameters: [
                {
                    name: "type",
                    in: "query",
                    schema: {
                        type: "string",
                        description: "Either rig, staging, or repair to define which locations to find",
                        example: 'rig'
                    }
                }
            ],
            responses: {
                '200': {
                    description: 'Successfully retrieved location data',
                    content: {
                        'application/json': {
                            schema: {
                                oneOf: [
                                    {
                                        $ref: '#/components/schemas/Rigs',
                                    },
                                    {
                                        $ref: '#/components/schemas/StagingFacilities',
                                    },
                                    {
                                        $ref: '#/components/schemas/RepairFacilities'
                                    }],
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