const customerPaths = {
    'root': {

    },
    'load': {
        put: {
            tags: ['Customers'],
            description: 'Load sample customer data from file into database',
            operationId: 'loadCustomers',
            parameters: [],
            responses: {
                '200': {
                    description: 'Customer sample data was successfully loaded into the database',
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

module.exports = customerPaths;