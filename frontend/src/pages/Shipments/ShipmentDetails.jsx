import React, { useEffect, useState } from 'react';

//Library tools
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Imports
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Tooltip from '@material-ui/core/Tooltip';

//Icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

//Custom Components
import SimpleList from '../../components/Tables/SimpleList';
import Map from '../../components/General/Map';
import Header from '../../components/General/Header'

//Tools
import { dateOptions } from '../../utils/constants.utils';
import { prettyStringify } from '../../utils/mapping.utils';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "10px",
    },
    paper: {
        width: "100%",
        paddingBottom: "75px"
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
    const [shipment, setShipment] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasLocations, setHasLocations] = useState(false);

    /* Fetch shipment information */
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/shipments/${key}`)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then(json => {
                if (json) {
                    setShipment(({
                        ...json, manifest: json.manifest.map(item => {
                            const vals = Object.values(item);
                            vals.shift();
                            return vals;
                        })
                    }));
                    const head = Object.keys(json.manifest[0]);
                    try {
                        if (json.shipTo["coordinates"].length > 0 && json.shipFrom["coordinates"].length > 0) {
                            setHasLocations(true);
                        }
                    } catch {
                        setHasLocations(false);
                    }
                    head.shift();
                    setHeaders(head);
                    setLoading(false);
                }
            });

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
                                        {
                                            loading ?
                                                <Skeleton variant="text" />
                                                : <Typography variant="body1">{key}</Typography>
                                        }
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Type</Typography>
                                        {
                                            loading ?
                                                <Skeleton variant="text" />
                                                : <Typography variant="body1">{shipment.shipmentType}</Typography>
                                        }

                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Status</Typography>
                                        {
                                            loading ?
                                                <Skeleton variant="text" />
                                                : <Typography variant="body1">{shipment.status}</Typography>
                                        }

                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Created By</Typography>
                                        {
                                            loading ?
                                                <Skeleton variant="text" />
                                                : <Typography variant="body1">{shipment.createdBy}</Typography>
                                        }

                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Ship From</Typography>
                                        {
                                            loading ?
                                                <Skeleton variant="text" />
                                                : <Tooltip title={
                                                    <div>
                                                        {prettyStringify(shipment.shipFrom, ["_id", "__v"])}
                                                    </div>
                                                }>
                                                    <Typography variant="body1">{shipment.shipFrom.locationName}</Typography>
                                                </Tooltip>
                                        }

                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Ship To</Typography>
                                        {
                                            loading ?
                                                <Skeleton variant="text" />
                                                : <Tooltip title={
                                                    <div>
                                                        {prettyStringify(shipment.shipTo, ["_id", "__v"])}
                                                    </div>
                                                }>
                                                    <Typography variant="body1">{shipment.shipTo.locationName}</Typography>
                                                </Tooltip>
                                        }

                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Date Created</Typography>
                                        {
                                            loading ?
                                                <Skeleton variant="text" />
                                                : <Typography variant="body1">{new Date(shipment.created).toLocaleDateString('en-US', dateOptions)}</Typography>
                                        }

                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Contract ID</Typography>
                                        {
                                            loading ?
                                                <Skeleton variant="text" />
                                                : <Typography variant="body1">{shipment.contractId}</Typography>
                                        }

                                    </Grid>

                                    {
                                        shipment && !loading ?
                                            shipment.updated ?
                                                <Grid item xs={3} className={classes.item}>
                                                    <Typography variant="subtitle1" className={classes.break}>Last Updated</Typography>
                                                    <Typography variant="body1">{new Date(shipment.updated).toLocaleDateString('en-US', dateOptions)}</Typography>
                                                </Grid>
                                                : null
                                            : null
                                    }

                                </Grid>

                                <Grid container className={classes.item}>
                                    <Grid item xs={12} sm={12} md={hasLocations ? 6 : !shipment ? 6 : 12} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Shipment Manifest</Typography>
                                        {/* List of child components */}
                                        {
                                            loading ?
                                                <Skeleton variant="rect" height={300} style={{ borderRadius: "6px" }} />
                                                : <SimpleList
                                                    label="shipment manifest"
                                                    data={shipment.manifest}
                                                    headers={headers.map(key => {
                                                        const regex = /(\b[a-z](?!\s))/g;
                                                        const newString = key.replace(regex, (str) => str.toUpperCase());
                                                        return newString === "Serialized" ? null : newString;
                                                    })}
                                                    link="/assets/"
                                                />
                                        }

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} className={classes.item}>
                                        {(hasLocations || loading) ? <Typography variant="subtitle1" className={classes.break}>Route</Typography> : null}
                                        {/* Map */}
                                        {
                                            loading ?
                                                <Skeleton variant="rect" height={300} style={{ borderRadius: "6px" }} />
                                                : hasLocations ?
                                                    <Map
                                                        start={shipment.shipFrom}
                                                        end={shipment.shipTo}
                                                    />
                                                    : null
                                        }

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