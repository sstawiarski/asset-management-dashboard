import React from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Typography';
import Header from '../components/Header'
import AssetTimeline from '../components/AssetTimeline'

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "10px"
    },
    paper: {
        width: "100%",
    },
    item: {
        padding: "10px"
    },
    center: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "50%"
    },
    break: {
        flexGrow: 1,
        fontWeight: "bold"
    }
}))

const sampleAsset = {
    assetName: "Gap Sub",
    assetType: "Asset",
    deployedLocation: "Rig ABC",
    owner: "Evolution-USA",
    parentId: "G800-1119",
    createdOn: new Date(2015, 11, 17),
    lastUpdated: null,
    serial: "G800-1111",
    checkedOut: true,
    groupTag: "",
    assignmentType: "Rental",
    assignee: "Nabors Drilling",
    contractNumber: "202012345",
    retired: false,
};
const sampleEvents = [
    {
        productIds: [
            "G800-1111",
            "C800-1011"
        ],
        key: "SHIP-1010",
        eventType: "Outgoing Shipment",
        eventDate: new Date(2020, 10, 9),
        eventData: {
            status: "Staging",
            shipmentType: "Outgoing",
            shipFrom: {
                "origin": "Evolution Calgary",
            },
            shipTo: {
                destination: "Nabors Rig 1212",
            },
            specialInstructions: "",
            contractId: "123456",
            manifest: [
                {
                    serial: "G800-1111",
                    type: "Asset",
                    quantity: 1,
                    notes: ""
                },
                {
                    serial: "C800-1011",
                    type: "Asset",
                    quantity: 1,
                    notes: ""
                }
            ]
        }
    },
    {
        productIds: [
            "G800-1111",
        ],
        key: "OWN-909",
        eventDate: new Date(2019, 7, 15),
        eventType: "Change of Ownership",
        eventData: {
            authorizer: "John Smith",
            newOwner: "Evolution-Canada",
            oldOwner: "Supply Chain USA"
        }
    }
]

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
}

const AssetDetails = () => {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <Header heading="Products" />
            <Grid container>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item>
                            <Paper className={classes.paper}>
                                <Typography className={classes.item} variant="h6">Product Details</Typography>
                                <Divider />
                                <Grid container>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Name</Typography>
                                        <Typography variant="body1">{sampleAsset.assetName}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Serial Number</Typography>
                                        <Typography variant="body1">{sampleAsset.serial}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Status</Typography>
                                        <Typography variant="body1">{sampleAsset.retired ? "Retired" : "Active"}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Checked Out</Typography>
                                        <Typography variant="body1">{sampleAsset.checkedOut ? "Yes" : "No"}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Assignee</Typography>
                                        <Typography variant="body1">{sampleAsset.assignee}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Created On</Typography>
                                        <Typography variant="body1">{sampleAsset.createdOn.toLocaleDateString('en-US', dateOptions)}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Type</Typography>
                                        <Typography variant="body1">{sampleAsset.assetType}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Location</Typography>
                                        <Typography variant="body1">{sampleAsset.deployedLocation}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Owner</Typography>
                                        <Typography variant="body1">{sampleAsset.owner}</Typography>
                                    </Grid>
                                    {
                                        sampleAsset.lastUpdated ?
                                            <Grid item xs={3} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>Last Updated</Typography>
                                                <Typography variant="body1">{sampleAsset.lastUpdated}</Typography>
                                            </Grid>
                                            : null
                                    }
                                </Grid>

                                <Grid container>
                                    {
                                        sampleAsset.assetType === "Assembly" ?
                                            <Grid item xs={12} sm={6} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>Asset Components</Typography>
                                            </Grid>
                                            : null
                                    }
                                    <Grid item xs={12} sm={sampleAsset.assetType !== "Assembly" ? 8 : 6} className={sampleAsset.assetType !== "Assembly" ? classes.center : classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Asset Timeline</Typography>
                                        <AssetTimeline data={sampleEvents} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default AssetDetails;