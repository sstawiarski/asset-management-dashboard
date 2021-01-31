const employeePaths = {
    'root': {

    },
    'load': {
        put: {
            tags: ['Employees'],
            description: 'Load sample employee data from file into database',
            operationId: 'loadEmployees',
            parameters: [],
            responses: {
                '200': {
                    description: 'Employee sample data was successfully loaded into the database',
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
    'getById': {
        get: {
            tags: ['Employees'],
            description: 'Retreive a single employee name based on a supplied ID',
            operationId: 'findEmployee',
            parameters: [
                {
                    name: 'employeeId',
                    in: 'path',
                    schema: {
                        type: 'string',
                        example: '1238671',
                        description: "Employee's unique numerical ID"
                    },
                    required: true

                }
            ],
            responses: {
                '200': {
                    description: 'Employee information was found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string'
                                    },
                                    employeeId: {
                                        type: 'number'
                                    }
                                }
                            }
                        }
                    }
                },
                '404': {
                    description: 'No employee with the specified ID was found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error attempting to find employee',
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

module.exports = employeePaths;