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
    }
}

module.exports = employeePaths;