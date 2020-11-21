const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { searchFilter } = require('../documentation/schemas');
const { count } = require('../models/asset.model');
const connection = mongoose.connection;
const Asset = require('../models/asset.model');
const sampleAssets = require('../sample_data/sampleAssets.data')
const options = {
    page: 1,
    limit: 2,
    collation: {
      locale: 'en'
    }
};

router.get('/', async (req, res, err) => {
    try {
        if (req.query.search) {
            const searchTerm = req.query.search.replace("-", "");
            let assets = [];
            if (req.query.viewAll) {
                const limit = parseInt(req.query.limit, 10);
                const page = parseInt(req.query.page, 10);
                assets = await Asset.fuzzySearch(searchTerm).limit(limit).skip(limit * page).exec();
            } else {
                assets = await Asset.fuzzySearch(searchTerm).limit(5);
            }
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
                        if (req.query.viewAll) {
                            const count = await Asset.fuzzySearch(searchTerm).countDocuments();
                            let result = {
                                assets: assets,
                                count: count
                            }
                            res.status(200).json(result);
                        } else {
                            res.status(200).json(assets);
                        }
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
            const assets = await Asset.find({}).sort({'dateCreated': 1});
            if (assets) res.status(200).json(assets);
            else res.status(500).json({
                message: "No assets found in database",
                interalCode: "no_assets_found"
            })
        }

    }
    catch (err) {
        console.log(err)
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

        res.status(200).json({message: "success"})
    }
    catch (err) {
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
})

router.post('/create-Assembly', async (req, res, err) => {
    try {
    	const serial = req.body.Assets
        const override = req.body.override      

    	// Queryig DB to find the assetTYPE
    	 const asset = await Asset.findOneAndUpdate({ assetName: req.body.assetName, owner : null },{ assetType : "Assembly", owner : "Supply Chain" });

    	 if (override){
                await Asset.updateMany({ serial : { $in : serial }}, { parentId : asset.serial })
              res.status(200).json({message:"Successfully updated"})
                        
         } else {
            
            const findSerial = await Asset.find ({ serial :{ $in : serial }, parentId : null })
            if(findSerial.length===serial.length){
                await Asset.updateMany ({ serial : { $in: serial }},{ parentId:asset.serial })
                res.status(200).json({ message : "Successfully updated" })
            }
            else{
                await Asset.updateMany ({ serial: { $in : serial }, parentId : null}, { parentId : asset.serial })
                res.status(250).json({ message:"failed to update some assets" })
            }
        }
        
    } catch (err) {
        console.log(err)
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
})



























module.exports = router;
