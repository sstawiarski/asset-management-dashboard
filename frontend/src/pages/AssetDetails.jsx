import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Typography';
import Header from '../components/Header'
import AssetTimeline from '../components/AssetTimeline'
import Manifest from '../components/Manifest';
import { Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
    }
}));

const AssetDetails = (props) => {

    const { serial } = props.match.params;
    const classes = useStyles();
    const [asset, setAsset] = useState({});
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(0);
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/assets/${serial}`)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return {};
                }
            })
            .then(json => {
                setAsset(json);
            });

        fetch(`http://localhost:4000/events/${serial}?limit=5&skip=${page}`)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return [];
                }
            })
            .then(json => {
                if (json.length === 0) setEmpty(true);
                setEvents([...events, ...json]);
            });
    }, [page, serial]);

    return (
        <div className={classes.root}>
            <Header heading="Products" />

            <Grid container>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item>
                            <Button className={classes.button} onClick={() => props.history.goBack()}>
                                <ArrowBackIosIcon fontSize="inherit" />
                                <span style={{ position: "relative", top: "-2px" }}>Back</span>
                            </Button>
                            <Paper className={classes.paper}>
                                <Typography className={classes.item} variant="h6">Product Details</Typography>
                                <Divider />
                                <Grid container>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Name</Typography>
                                        <Typography variant="body1">{asset.assetName}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Serial Number</Typography>
                                        <Typography variant="body1">{asset.serial}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Status</Typography>
                                        <Typography variant="body1">{asset.retired ? "Retired" : "Active"}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Checked Out</Typography>
                                        <Typography variant="body1">{asset.checkedOut ? "Yes" : "No"}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Assignee</Typography>
                                        <Typography variant="body1">{asset.assignee ? asset.assignee : "N/A"}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Created On</Typography>
                                        <Typography variant="body1">{asset.dateCreated ? new Date(asset.dateCreated).toLocaleDateString('en-US', dateOptions) : null}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Type</Typography>
                                        <Typography variant="body1">{asset.assetType}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Location</Typography>
                                        <Typography variant="body1">{asset.deployedLocation ? asset.deployedLocation : "N/A"}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Owner</Typography>
                                        <Typography variant="body1">{asset.owner}</Typography>
                                    </Grid>
                                    {
                                        asset.dateUpdated ?
                                            <Grid item xs={3} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>Last Updated</Typography>
                                                <Typography variant="body1">{asset.dateUpdated ? new Date(asset.dateUpdated).toLocaleDateString('en-US', dateOptions) : "Never"}</Typography>
                                            </Grid>
                                            : null
                                    }
                                </Grid>

                                <Grid container className={classes.item}>
                                    {
                                        asset.assetType === "Assembly" ?
                                            <Grid item xs={12} sm={12} md={6} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>Assembly Manifest</Typography>
                                                <Manifest data={asset} />
                                            </Grid>
                                            : null
                                    }
                                    <Grid item xs={12} sm={12} md={asset.assetType !== "Assembly" ? 8 : 6} className={asset.assetType !== "Assembly" ? classes.center : classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Asset Timeline</Typography>
                                        <AssetTimeline data={events} onMore={() => setPage(page+1)} empty={empty} />
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