const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { searchFilter } = require('../documentation/schemas');
const connection = mongoose.connection;
const Asset = require('../models/asset.model');
const Event = require('../models/event.model');
const Counter = require('../models/counter.model');

const sampleAssets = require('../sample_data/sampleAssets.data')

router.get('/', async (req, res, err) => {
    try {
        if (req.query.search) {
            const searchTerm = req.query.search.replace("-", "");
            const assets = await Asset.fuzzySearch(searchTerm).limit(5);
            if (assets.length) {
                if (assets[0].serial.toUpperCase() === req.query.search.toUpperCase()) {
                    const result = [assets[0]]
                    res.status(200).json(result)
                }
                else {
                    if (assets[0].confidenceScore > 10) {
                        const result = assets.filter(asset => asset.confidenceScore > 10);
                        res.status(200).json(result);

                    } else {
                        res.status(200).json(assets);
                    }
                }
            } else {
                res.status(500).json({
                    message: 'No assets found for serial',
                    internalCode: 'no_assets_found'
                })
            }
        }
        else {
            const assets = await Asset.find({}).sort({ 'dateCreated': 1 });
            if (assets) res.status(200).json(assets);
            else res.status(500).json({
                message: "No assets found in database",
                interalCode: "no_assets_found"
            })
        }

    }
    catch (err) {
        console.log(err.message)
    }
})

/* Update assets and assemblies with fields 
*  Updates children as well
*  Should support all future bulk edit options
*/
router.patch("/", async (req, res) => {
    try {
        //list of selected serials from client
        const list = req.body.assets;

        //object from client representing fields to update
        //should really only be one
        const field = req.body.update;
        const fieldName = Object.getOwnPropertyNames(field)[0];

        //get all parent assembly documents so we can get their serial and update children
        //searches through array we got from client using $in
        const parentAssemblies = await Asset.find({ serial: { $in: list }, assetType: "Assembly" }).select({ serial: 1 });

        //get assets too so we can link to the new event
        let foundAssets = [];
        foundAssets = await Asset.find({ serial: { $in: list }, assetType: "Asset" }).select({ serial: 1 });
        

        //updates main assets and assemblies selected
        //See mongoose API docs -- [Model name].updateMany( { filters }, { fields and values to update });
        //returns object with a property 'n' representing number of documents updated
        await Asset.updateMany({ serial: { $in: list }, assetType: "Assembly" }, field);
        await Asset.updateMany({ serial: { $in: list }, assetType: "Asset" }, field);

        //use parent assemblies we found earlier to get their serials to find children
        let parentSerials = [];
        parentAssemblies.map((assembly) => {
            parentSerials.push(assembly.serial);
        });

        //keep track of children too
        let foundChildren = [];

        if (parentSerials.length) {
            foundChildren = await Asset.find({ parentId: { $in: parentSerials }, assetType: "Asset" }).select({ serial: 1});
            await Asset.updateMany({ parentId: { $in: parentSerials } }, field);
        }

        //get event type and key beginning -- function declared at bottom of this file
        const eventInfo = getEventType(fieldName);
        const counter = await Counter.findOneAndUpdate({name: "events"}, { $inc: {next: 1}}, { useFindAndModify: false}); //get counter and increment for event key
        
        //make up array of all serials affected
        let allAffectedAssets = [];
        if (foundAssets.length) {
            foundAssets.map((asset) => {
                allAffectedAssets.push(asset.serial);
            })
        }
        if (foundChildren.length) {
            foundChildren.map((child) => {
                allAffectedAssets.push(child.serial);
            })
        }

        allAffectedAssets = [...allAffectedAssets, ...parentSerials];

        //generate new event and save
        //TODO: make up eventData is some kind of predefined way
        const event = new Event({
            eventType: eventInfo[0],
            eventTime: Date.now(),
            key: `${eventInfo[1]}${counter.next}`,
            productIds: allAffectedAssets,
            eventData: {
                details: `Changed ${allAffectedAssets.length} product(s) ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} to ${field[fieldName]}.`
            }
        });
        await event.save();

        //use lengths from found arrays to send a response
        res.status(200).json({
            message: `Updated ${foundAssets.length} regular assets, ${parentSerials.length} assemblies, and ${foundChildren.length} of their children.`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error updating assets",
            internal_code: "asset_update_error"
        })
    }
})

router.put('/load', async (req, res) => {
    try {
        sampleAssets.forEach(async (item) => {
            console.log(item)
            const asset = new Asset({
                ...item,
                dateCreated: Date.now()
            });
            await asset.save();
        })

        res.status(200).json({ message: "success" })
    }
    catch (err) {
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
})

router.get('/:serial', async (req, res, err) => {
    const serial = req.params.serial;
    try {
        const asset = await Asset.find({ serial: serial });

        if (asset.length) {
            res.status(200).json(asset[0]);
        } else {
            res.status(500).json({
                message: 'No assets found for serial',
                internalCode: 'no_assets_found'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: 'serial is missing',
            interalCode: 'missing_parameters'
        });
    }
})

router.get('/searchFilter', async (req, res, err) => {
    const filter = req.params.search;
    try {
        const asset = await Asset.find({ searchFilter: searchFilter });

        if (asset.length) {
            res.status(200).json(asset[0]);
        } else {
            res.status(500).json({
                message: 'No assets found for serial',
                internalCode: 'no_assets_found'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: 'serial is missing',
            interalCode: 'missing_parameters'
        });
    }
});


//gets the appropriate eventType string and beginning of key string for the event document based on the fied
//TODO: add more switches for the different types of fields
function getEventType(field) {
    switch (field) {
        case "retired": 
        return ["Change of Retirement Status", "RET-"]
    }
}
module.exports = router;