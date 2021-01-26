const authPaths = {
    login: {
        post: {
            tags: ['Authentication'],
            description: 'User authentication with email/username and password',
            operationId: 'userAuthentication',
            parameters: [
                {
                    name: 'username',
                    in: 'body',
                    schema: {
                        type: 'string',
                        description: 'Employee username, required if email not supplied'
                    },
                    required: false
                },
                {
                    name: 'email',
                    in: 'body',
                    schema: {
                        type: 'string',
                        description: 'Employee email, required if username not supplied'
                    },
                    required: false
                },
                {
                    name: 'password',
                    in: 'body',
                    schema: {
                        type: 'string',
                        description: 'Employee password'
                    },
                    required: true
                },

            ],
            responses: {
                '200': {
                    description: 'User successfully authenticated',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/userInfo'
                            }
                        }
                    }
                },
                '400': {
                    description: 'Login information missing',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '403': {
                    description: 'Password incorrect',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '404': {
                    description: 'No used found for supplied username or email',
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

module.exports = authPaths;