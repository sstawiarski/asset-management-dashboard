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

/**
 * Get all attachments for a shipment based on the shipment key
 */
router.get('/shipment/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const shipment = await Shipment.findOne({ key: key }, { _id: 0, attachments: 1 });
        if (shipment) {
            res.status(200).json(shipment);
        } else {
            res.status(404).json({ message: "No shipment found for key", internalCode: "no_shipment_found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error", internalCode: "internal_server_error" });
    }
});


/**
 * Upload an attachment to the shipment with the provided key
 */
router.post('/shipment/:key', upload, async (req, res) => {

    const { key } = req.params; //shipment key
    const { name } = req.body; //user name who added the attachment


    /* Map the array of uploaded files to an array of Attachment objects */
    const files = req.files.map(file => {
        return {
            uuid: file.filename.split('.')[0],
            filename: file.originalname,
            link: file.filename,
            fileType: mime.extension(file["mimetype"]).toLowerCase(),
            user: name,
            dateAdded: Date.now()
        };
    });

    try {
        /* Add each new attachment to the matching shipment's attachments array */
        const shipment = await Shipment.updateOne(
            {
                key: key
            },
            {
                $push: {
                    attachments: { $each: files }
                }
            }
        );

        /* Send success message if shipment was found and updated, otherwise send error */
        if (shipment.nModified > 0) {
            res.status(200).json({ message: "Success" });
        } else {
            res.status(404).json({ message: "No shipment found for key", internalCode: "no_shipment_found" });
        }

    } catch (err) {
        res.status(500).json({ message: "Internal server error", internalCode: "internal_server_error" });
    }

});

/**
 * Get the attachment file based on its local name
 */
router.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    let file;
    try {
        file = await fs.readFile(`public/uploads/${uuid}`);
    } catch (err) { }

    if (!file) {
        res.status(404).json({ message: "Attachment not found", internalCode: "attachment_not_found" });
    } else {
        res.status(200).send(file).end();
    }

});

/**
 * Delete an attachment based on its UUID
 */
router.delete('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    try {
        /* Find the shipment that contains the attachment */
        const shipment = await Shipment.findOne({ attachments: { $elemMatch: { uuid: uuid } } });

        if (!shipment) {
            /* No matching shipment with attachment */
            res.status(404).json({ message: "Shipment not found", internalCode: "shipment_not_found" });
        } else {
            /* Extract the attachment object from the shipment */
            const obj = shipment["attachments"].find(item => item["uuid"] === uuid);

            /* Get relative path to the file so it can be deleted */
            const link = `public/uploads/${obj["link"]}`;

            /* Remove attachment object from the shipment document and save */
            shipment["attachments"] = shipment["attachments"].filter(attachment => attachment["uuid"] !== uuid);
            await shipment.save();

            /* Delete attachment from the filesystem */
            await fs.unlink(link);

            res.status(200).json({ message: "Successfully deleted attachment" });
        }
    } catch (err) {
        res.status(500).json({ message: "Could not delete attachment", internalCode: "attachment_deletion_error" });
    }
});

module.exports = router;
