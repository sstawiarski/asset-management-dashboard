const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const Shipment = require('../models/shipment.model');
const multer = require("multer");
const path = require("path");
const uuid = require('uuid').v4;
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
});
const mime = require('mime-types');

/* Initialize multer with 15MiB max file size */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 15728640
    }
}).array("attachment");


module.exports = router;
