const attachmentPaths = {
    getByName: {
        get: {
            tags: ['Attachments'],
            description: 'Get an attachment file based on its unique name',
            operationId: 'getAttachmentByName',
            parameters: [
                {
                    name: 'name',
                    in: 'path',
                    schema: {
                        type: 'string'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'File successfully retrieved',
                    content: {
                        'application/octet-stream': {
                            schema: {
                                type: "string",
                                format: "binary",
                                description: "The binary file"
                            }
                        }
                    }
                },
                '404': {
                    description: 'Attachment not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error retrieving file',
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
    getForShipment: {
        get: {
            tags: ['Attachments'],
            description: 'Get all attachments for a shipment based on the shipment key',
            operationId: 'getAttachmentsForShipment',
            parameters: [
                {
                    name: 'key',
                    in: 'path',
                    schema: {
                        type: 'string',
                        description: 'The shipment key'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'File(s) successfully uploaded',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    attachments: {
                                            $ref: '#/components/schemas/attachments'
                                    }
                                }
                            }
                        }
                    }
                },
                '404': {
                    description: 'No shipment found for key',
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
        }
    },
    postToKey: {
        post: {
            tags: ['Attachments'],
            description: 'Upload any number of files to the shipment denoted by the key',
            operationId: 'uploadAttachments',
            parameters: [
                {
                    name: 'key',
                    in: 'path',
                    schema: {
                        type: 'string'
                    },
                    required: true
                },
                {
                    name: 'name',
                    in: 'body',
                    schema: {
                        type: 'string',
                        description: 'The name of the user uploading the attachments'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'File(s) successfully uploaded',
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
                '404': {
                    description: 'No shipment found for key',
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
        }
    },
    deleteByUUID: {
        delete: {
            tags: ['Attachments'],
            description: 'Delete an attachment from its shipment and the filesystem based on its UUID',
            operationId: 'deleteAttachment',
            parameters: [
                {
                    name: 'uuid',
                    in: 'path',
                    schema: {
                        type: 'string'
                    },
                    required: true
                }
            ],
            responses: {
                '200': {
                    description: 'Attachment successfully deleted',
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
                '404': {
                    description: 'No shipment found containing attachment',
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
        }
    }
}

module.exports = attachmentPaths;