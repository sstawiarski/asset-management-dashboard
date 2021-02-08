const assetPaths = {
    'root': {
        get: {
            tags: ['Assets'],
            description: 'Get an array of assets from the database based on the filters provided',
            operationId: 'getAllAssets',
            parameters: [
                {
                    name: 'search',
                    in: 'query',
                    schema: {
                        $ref: '#/components/schemas/searchSerial'
                    },
                    required: false
                },

                {
                    name: 'sort_by',
                    in: 'query',
                    schema: {
                        $ref: '#/components/schemas/sort_by'
                    },
                    required: false

                },

                {
                    name: 'order',
                    in: 'query',
                    schema: {
                        ref: '#/components/schemas/order'
                    },
                    required: false
                }

            ],
            responses: {
                '200': {
                    description: 'Assets were found in the database',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Assets'
                            }
                        }
                    }
                },
                '404': {
                    description: 'No assets found in the database',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '500': {
                    description: 'Unknown error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: ['Assets'],
            description: 'Provision serial and create new asset with provided defaults',
            operationId: 'createAsset',
            parameters: [
                {
                    name: 'list',
                    in: 'body',
                    schema: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/serial'
                        }
                    },
                    required: false
                },

                {
                    name: 'serialBase',
                    in: 'body',
                    schema: {
                        type: 'string',
                        example: 'G800-',
                        description: 'The base serial for the asset type to be created'
                    },
                    required: false

                },

                {
                    name: 'owner',
                    in: 'body',
                    schema: {
                        type: 'string',
                        example: 'Supply Chain-USA',
                        description: 'The initial default owner for the created assets'
                    },
                    required: true
                },

                {
                    name: 'type',
                    in: 'body',
                    schema: {
                        type: 'string',
                        example: 'range',
                        description: "The method by which to provision, either 'range' or 'list'"
                    },
                    required: true
                },

                {
                    name: 'assetName',
                    in: 'body',
                    schema: {
                        type: 'string',
                        example: 'Gap Sub',
                        description: 'The plaintext name of the asset type to be created'
                    },
                    required: true
                },

                {
                    name: 'beginRange',
                    in: 'body',
                    schema: {
                        type: 'number',
                        example: '12312',
                        description: 'The serial number to begin provisioning at when using the range method'
                    },
                    required: false
                },

                {
                    name: 'endRange',
                    in: 'body',
                    schema: {
                        type: 'number',
                        example: '234234',
                        description: 'The serial number to end provisioning at when using the range method (inclusive)'
                    },
                    required: false
                },
                {
                    name: 'user',
                    in: 'body',
                    schema: {
                        type: 'string'
                    },
                    description: 'Encrypted user id information',
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'Assets were successfully loaded into the database',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string'
                                    },
                                    invalid: {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            description: 'The serials that could not be provisioned'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '403': {
                    description: 'Required parameters missing',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }

        },
        patch: {
            tags: ['Assets'],
            description: "Updates fields in asset(s) (and children if applicable) and generate event object",
            operationId: "updateField",
            parameters: [
                {
                    name: 'assets',
                    in: 'body',
                    schema: {
                        $ref: '#/components/schemas/serialList'
                    },
                    required: true,
                    description: "Array of asset serials (must always be array even if only 1 serial)"
                },
                {
                    name: 'update',
                    in: 'body',
                    schema: {
                        type: 'object',
                        properties: {
                            insertFieldNameHere: {
                                example: "[insert new value here]"
                            }
                        }
                    },
                    description: "Object containing the MongoDB field name as a property and the new value as its value",
                    required: true
                },
                {
                    name: 'override',
                    in: 'body',
                    schema: {
                        type: 'boolean'
                    },
                    description: 'Boolean whether or not to force update child assets whose assembly is not getting updated, remove them from the assembly, and mark it incomplete',
                    required: false
                },
                {
                    name: 'user',
                    in: 'body',
                    schema: {
                        type: 'string'
                    },
                    description: 'Encrypted user id information',
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'Successfully updated assets',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Updated 2 regular assets, 2 assemblies, and 3 of their children."
                                    },
                                    key: {
                                        type: "string",
                                        example: "GRP-8971"
                                    }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error updating assets',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        },

    },
    'load': {

        put: {
            tags: ['Assets'],
            description: 'Load sample asset data from file into database',
            operationId: 'loadAssets',
            parameters: [],
            responses: {
                '200': {
                    description: 'Assets were successfully loaded into the database',
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
    findByFilter: {
        get: {
            tags: ['Assets'],
            description: 'Find an array of up to 5 assets based on the filter input',
            operationId: 'findByFilter',
            parameters: [
                {
                    name: 'searchFilter',
                    in: 'path',
                    schema: {
                        $ref: '#/components/schemas/searchFilter'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'A single matching asset to the serial path parameter',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Asset'
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
                    description: 'No matching assets found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'No assets found for serial',
                                internalCode: 'no_assets_found'
                            }
                        }
                    }
                }
            }
        }
    },
    'assembly/schema': {
        put: {
            tags: ['Assets'],
            description: 'Load sample assembly schema data into the database',
            operationId: 'loadAssemblySchemas',
            parameters: [],
            responses: {
                '200': {
                    description: 'Assembly schemas were successfully loaded into the database',
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
                '503': {
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
    'assembly': {
        post: {
            tags: ['Assets'],
            description: 'Create a new assembly and update its children',
            operationId: 'assemblyCreate',
            parameters: [
                {
                    name: 'serial',
                    in: 'body',
                    schema: {
                        $ref: '#/components/schemas/serial'
                    },
                    required: true
                },
                {
                    name: 'assetName',
                    in: 'body',
                    schema: {
                        $ref: '#/components/schemas/assetType'
                    },
                    required: true
                },
                {
                    name: 'assets',
                    in: 'body',
                    description: 'Child assets of the assembly to create',
                    schema: {
                        $ref: '#/components/schemas/productIds'
                    },
                    required: true
                },
                {
                    name: 'missingItems',
                    in: 'body',
                    description: 'Plaintext names of the assets the assembly is missing',
                    schema: {
                        type: 'array',
                        description: 'Names of the asset types the assembly is missing',
                        items: {
                            type: 'string',
                            example: 'Landing Sub'
                        }
                    },
                    required: false
                },
                {
                    name: 'owner',
                    in: 'body',
                    schema: {
                        $ref: '#/components/schemas/owner'
                    },
                    required: true
                },
                {
                    name: 'groupTag',
                    in: 'body',
                    schema: {
                        $ref: '#/components/schemas/groupTag'
                    },
                    required: true
                },
                {
                    name: 'override',
                    in: 'body',
                    schema: {
                        type: 'boolean',
                        description: 'Whether or not to override child parent assignments and remove them from their existing parent'
                    },
                    required: true
                },
                {
                    name: 'user',
                    in: 'body',
                    schema: {
                        type: 'string'
                    },
                    description: 'Encrypted user id information',
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'Assembly successfully created and child assets successfully updated',
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
                '403': {
                    description: 'Some selected assets already had parent ids and were not overridden',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string'
                                    },
                                    internalCode: {
                                        type: 'string'
                                    },
                                    used: {
                                        $ref: '#/components/schemas/productIds'
                                    }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error creating assembly',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        },
        patch: {
            tags: ['Assets'],
            description: 'Update an assembly and its children',
            operationId: 'assemblyUpdate',
            parameters: [
                {
                    name: 'serial',
                    in: 'body',
                    schema: {
                        $ref: '#/components/schemas/serial'
                    },
                    required: true
                },
                {
                    name: 'missingItems',
                    in: 'body',
                    schema: {
                        type: 'array',
                        description: 'Names of the asset types the assembly is missing',
                        items: {
                            type: 'string',
                            example: 'Landing Sub'
                        }
                    },
                    required: false
                },
                {
                    name: 'assets',
                    in: 'body',
                    schema: {
                        $ref: '#/components/schemas/productIds'
                    },
                    required: true
                },
                {
                    name: 'user',
                    in: 'body',
                    schema: {
                        type: 'string'
                    },
                    description: 'Encrypted user id information',
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'Assembly and children successfully updated',
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
                    description: 'Error updating assembly',
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
    findBySerial: {
        get: {
            tags: ['Assets'],
            description: 'Find a single asset based on the serial provided',
            operationId: 'findBySerial',
            parameters: [
                {
                    name: 'serial',
                    in: 'path',
                    schema: {
                        $ref: '#/components/schemas/serial'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'A single matching asset to the serial path parameter',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Asset'
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
                '404': {
                    description: 'No matching assets found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'No assets found for serial',
                                internalCode: 'no_assets_found'
                            }
                        }
                    }
                }
            }
        }
    }


}

module.exports = assetPaths;