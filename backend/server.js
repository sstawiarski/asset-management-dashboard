const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const redis = require('redis');
require('dotenv').config();

/* Caching setup */
const { cache } = require('./cache');
const cacheEnabled = process.env.ENABLE_CACHE === 'true' || false;
const redisClient = cacheEnabled ?
    redis
        .createClient(process.env.REDIS_CLIENT)
        .on('error', (err) => {
            if (err.code === 'ECONNREFUSED') {
                console.log('\x1b[31m', '\nERROR: Could not connect to Redis instance...');
                console.log('\x1b[33m', "Check that the REDIS_CLIENT value in .env is correct, or disable caching by setting ENABLE_CACHE to 'false'\n");
                process.exit(-1);
            }
        })
    : null;

/**
 * Binds Mongoose and Redis, to allow ".cache()" and ".clearCache()" to invoke Redis caching on returned documents
 */
try {
    cache(mongoose, redisClient, cacheEnabled);
} catch (error) {
    console.error(error);
}

const PORT = process.env.PORT || 4000;
app.use(cors({
    origin: process.env.CORS_URL
}));
app.use(express.json());

/* Connect to MongoDB */
mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected...')
    app.listen(PORT, function () {
        console.log("Server is running on Port: " + PORT);
    });
});

/* Routing */
const assetRoutes = require('./routes/assets.routes')
const eventRoutes = require('./routes/events.routes')
const employeeRoutes = require('./routes/employees.routes')
const customerRoutes = require('./routes/customers.routes')
const locationRoutes = require('./routes/locations.routes')
const assemblyRoutes = require('./routes/assemblies.routes')
const authRoutes = require('./routes/auth.routes')
const shipmentRoutes = require('./routes/shipments.routes')
const attachmentRoutes = require('./routes/attachments.routes')

/* Swagger config for API docs */
const swaggerConfig = require('./documentation/swagger.config');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use('/assets', assetRoutes);
app.use('/events', eventRoutes);
app.use('/employees', employeeRoutes);
app.use('/customers', customerRoutes);
app.use('/locations', locationRoutes);
app.use('/assemblies', assemblyRoutes);
app.use('/auth', authRoutes);
app.use('/shipments', shipmentRoutes);
app.use('/attachments', attachmentRoutes);