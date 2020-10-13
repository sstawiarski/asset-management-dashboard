const servers = require('./servers')
const tags = require('./tags');
const paths = require('./paths/paths')
const schemas = require('./schemas')

const swaggerConfig = {
    openapi: '3.0.3',
    info: {
        version: '1.0.0',
        title: 'Product Management Portal API',
        description: 'API for managing assets and shipments',
        termsOfService: '',
        contact: {
            name: 'Shawn Stawiarski',
            email: 'sastawia@asu.edu',
            url: 'https://shawnstawiarski.com/'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    servers: servers,
    tags: tags,
    paths: paths,
    components: {
        schemas: schemas
    }
};

module.exports = swaggerConfig;