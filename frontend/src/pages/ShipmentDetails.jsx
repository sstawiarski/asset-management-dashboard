import React, { useEffect, useState } from 'react';

//Library tools
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Imports
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Typography';
import Header from '../components/Header'

import SimpleList from '../components/Tables/SimpleList';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


//Tools
import { dateOptions } from '../utils/constants.utils';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "10px",
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
    },
    button: {
        display: "block"
    },
    error: {
        color: "red",
    },
    errorIcon: {
        position: "relative",
        color: "red",
        fontSize: "14px",
        top: "3px",
        paddingRight: "3px"
    },
    errorDiv: {
        display: "inline-block"
    },
    puzzle: {
        position: "relative",
        top: "3px",
        paddingRight: "3px",
        color: "#E5C92D",
        fontSize: "14px",
    },
    puzzleText: {
        color: "#E5C92D",
    }
}));

const ShipmentDetails = (props) => {

    const { key } = props.match.params;
    const classes = useStyles();

    // the active shipment
    // TODO: current using manually typed placeholder data
    const [shipment, setShipment] = useState({"createdBy":"Test 1","created":"1580774400000","updated":"1580774400000","completed":"1580774400000","status":"Staging","shipmentType":"Incoming","shipFrom":"Calgary","shipTo":"Houston","specialInstructions":"seriously, don't lose this","contractId":"345678","manifest":[{"item":"X800-87650","type":"crossover sub","quantity":"1","notes":"just testing this beast out!"},{"item":"box of boxes of batteries","type":"batteries","quantity":1500,"notes":"keep batteries in individual cases!  fire hazard!  there's a lot of 'em!"}]});

    /* Fetch shipment information */
    useEffect(() => {

        /* TODO: Not current functional, uncomment once API endpoint is implemented */

        /*
        fetch(`http://localhost:4000/shipments/${key}`)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then(json => {
                if (json) {
                    setShipment(({ ...json, manifest: json.manifest.map(item => Object.values(item)) }));
                }
            });
            */
    }, [key]);

    return (
        <div className={classes.root}>
            <Header heading="Shipments" />

            <Grid container>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item>
                            <Button className={classes.button} onClick={() => props.history.goBack()}>
                                <ArrowBackIosIcon fontSize="inherit" />
                                <span style={{ position: "relative", top: "-2px" }}>Back</span>
                            </Button>
                            <Paper className={classes.paper}>
                                <Typography className={classes.item} variant="h6">Shipment Details</Typography>
                                <Divider />
                                <Grid container>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Key</Typography>
                                        <Typography variant="body1">{key}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Type</Typography>
                                        <Typography variant="body1">{shipment.shipmentType}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Status</Typography>
                                        <Typography variant="body1">{shipment.status}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Created By</Typography>
                                        <Typography variant="body1">{shipment.createdBy}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Ship From</Typography>
                                        <Typography variant="body1">{shipment.shipFrom}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Ship To</Typography>
                                        <Typography variant="body1">{shipment.shipTo}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Date Created</Typography>
                                        <Typography variant="body1">{new Date(shipment.created).toLocaleDateString('en-US', dateOptions)}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Contract ID</Typography>
                                        <Typography variant="body1">{shipment.contractId}</Typography>
                                    </Grid>

                                    {
                                        shipment.updated ?
                                            <Grid item xs={3} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>Last Updated</Typography>
                                                <Typography variant="body1">{new Date(shipment.updated).toLocaleDateString('en-US', dateOptions)}</Typography>
                                            </Grid>
                                            : null
                                    }

                                </Grid>

                                <Grid container className={classes.item}>
                                            <Grid item xs={12} sm={12} md={6} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>Shipment Manifest</Typography>
                                                {/* List of child components */}
                                                <SimpleList 

                                                label="shipment manifest"
                                                data={shipment.manifest.map(item => Object.values(item))} 
                                                headers={Object.keys(shipment.manifest[0]).map(key => {
                                                    const regex = /(\b[a-z](?!\s))/g;
                                                    const newString = key.replace(regex, (str) => str.toUpperCase());
                                                    return newString;
                                                })}
                                                link="/shipments/"
                                                />
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

export default ShipmentDetails;