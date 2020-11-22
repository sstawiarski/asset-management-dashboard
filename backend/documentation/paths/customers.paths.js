const customerPaths = {
    'root': {
        get: {
            tags: ['Customers'],
            description: 'Retrieve a list of customers with the option to filter using a fuzzy search',
            parameters: [
                {
                    name: 'search',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        example: 'John Smith',
                        description: 'Customer or company name as a string; can be first, last, full name, or company name'
                    }
                }
            ],
            responses: {
                '200': {
                    description: 'Customers were found in the database',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Customers'
                            }
                        }
                    }
                },
                '404': {
                    description: 'No customers found in the database',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error retrieving customer list',
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