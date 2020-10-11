const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});