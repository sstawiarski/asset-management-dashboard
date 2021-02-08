const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const assetRoutes = require('./routes/assets.routes')
const eventRoutes = require('./routes/events.routes')
const employeeRoutes = require('./routes/employees.routes')
const customerRoutes = require('./routes/customers.routes')
const locationRoutes = require('./routes/locations.routes')
const assemblyRoutes = require('./routes/assemblies.routes')
const authRoutes = require('./routes/auth.routes')
const shipmentRoutes = require('./routes/shipments.routes')

const swaggerConfig = require('./documentation/swagger.config');

const PORT = 4000;
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://ser401:ser401@cluster0.bjvvr.mongodb.net/Explore?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {


    console.log('MongoDB connected...')
    app.listen(PORT, function () {
        console.log("Server is running on Port: " + PORT);
        
    });
});

app.get("/", async (req, res) => {
    if (req.query.type === "parent") {
        mongoose.connection.db.collection('assembly', (err, collection) => {
            collection.find({ serial: req.query.search }).toArray((err, data) => {
                res.json(data);
            })
        });
    } else {
        mongoose.connection.db.collection('asset', (err, collection) => {
            collection.find({ serial: req.query.search }).toArray((err, data) => {
                res.json(data);
            })
        });
    }
    
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use('/assets', assetRoutes);
app.use('/events', eventRoutes);
app.use('/employees', employeeRoutes);
app.use('/customers', customerRoutes);
app.use('/locations', locationRoutes);
app.use('/assemblies', assemblyRoutes);
app.use('/auth', authRoutes);
app.use('/shipments', shipmentRoutes);

