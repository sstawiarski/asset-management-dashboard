const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const redis = require('redis').createClient(process.env.REDIS_CLIENT);
const topcache = require('top-cache');
require('dotenv').config();

/**
 * Binds Mongoose and Redis, to allow ".cache()" and ".clearCache()" to invoke key/value
 * pair caching in Redis of data returned from Mongoose queries.
 */
try {
    topcache(mongoose, redis);
} catch (error) {
    console.error(error);
}


const assetRoutes = require('./routes/assets.routes')
const eventRoutes = require('./routes/events.routes')
const employeeRoutes = require('./routes/employees.routes')
const customerRoutes = require('./routes/customers.routes')
const locationRoutes = require('./routes/locations.routes')
const assemblyRoutes = require('./routes/assemblies.routes')
const authRoutes = require('./routes/auth.routes')
const shipmentRoutes = require('./routes/shipments.routes')
const attachmentRoutes = require('./routes/attachments.routes')

const swaggerConfig = require('./documentation/swagger.config');

const PORT = process.env.PORT || 4000;
app.use(cors({
    origin: process.env.CORS_URL
}));
app.use(bodyParser.json());

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

