import React, { useEffect, useState } from 'react';

//Library tools
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Imports
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

//Icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import EditIcon from '@material-ui/icons/Edit';
import ExtensionIcon from '@material-ui/icons/Extension';

//Dialogs
import AssemblyModificationWarning from '../../components/Dialogs/AssetDialogs/AssemblyModificationWarning';

//Custom Components
import Header from '../../components/General/Header'
import AssetTimeline from '../../components/General/AssetTimeline'
import Manifest from '../../components/General/Manifest';

//Tools
import { dateOptions } from '../../utils/constants.utils';

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

const AssetDetails = (props) => {

    const { serial } = props.match.params;
    const classes = useStyles();
    const history = useHistory();

    //the active asset
    const [asset, setAsset] = useState({});

    //the events for the timeline
    const [events, setEvents] = useState([]);

    //page of events
    const [page, setPage] = useState(0);

    //indicates no more pages of events to view
    const [empty, setEmpty] = useState(false);

    //warning dialog open status for when assembly is being disassembled
    const [warningOpen, setWarning] = useState(false);

    //Notify user if asset cannot be fetched
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertInfo, setAlertInfo] = useState({
        type: "",
        message: "",
    });

    /* Fetch asset information and first events page */
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/assets/${serial}`)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    if (response.status === 500) {
                        response.json().then((json) => {
                            setAlertInfo({
                                type: "error",
                                message: `Couldn't fetch asset information. (Error code: "${json?.internalCode}")`,
                            });
                        })
                    } else {
                        setAlertInfo({
                            type: "error",
                            message: "Could not fetch asset information...",
                        });
                    }
                    setAlertOpen(true);
                    return {};
                }
            })
            .then(json => {
                setAsset(json);
            })
            .catch(err => {
                setAlertInfo({
                    type: "error",
                    message: "Could not fetch some asset information...",
                });
                setAlertOpen(true);
            });

        fetch(`${process.env.REACT_APP_API_URL}/events/${serial}?limit=5&skip=${page}`)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return [];
                }
            })
            .then(json => {
                if (json.length === 0) setEmpty(true);
                setEvents(e => [...e, ...json]);
            });
    }, [page, serial]);

    /**
     * Clear state when user clicks a link to another asset
     * React-Router using same component and state on redirect, causes issues with events be duplicated 
     */
    const handleRedirect = (link) => {
        if (link === serial) return;
        setAsset({});
        setEvents([]);
        setPage(0);
        setEmpty(false);
    }

    return (
        <div className={classes.root}>
            <Header heading="Products" />

            <Grid container>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item>
                            <Button className={classes.button} onClick={() => { props.history.goBack(); handleRedirect(""); }}>
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
                                        <Typography variant="body1">{asset.retired ? "Retired" : asset?.retired === false ? "Active" : null}</Typography>
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
                                        <Typography variant="body1">{asset.deployedLocation ? typeof asset.deployedLocation === "object" ? asset["deployedLocation"].locationName : asset.deployedLocation : "N/A"}</Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Owner</Typography>
                                        <Typography variant="body1">{asset.owner}</Typography>
                                    </Grid>
                                    {
                                        asset.lastUpdated ?
                                            <Grid item xs={3} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>Last Updated</Typography>
                                                <Typography variant="body1">{new Date(asset.lastUpdated).toLocaleDateString('en-US', dateOptions)}</Typography>
                                            </Grid>
                                            : null
                                    }
                                </Grid>

                                <Grid container className={classes.item}>
                                    {/* Check whether asset is an Assembly and display manifest */}
                                    {
                                        asset.assetType === "Assembly" ?
                                            <Grid item xs={12} sm={12} md={6} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>Assembly Manifest</Typography>
                                                <div style={{ textAlign: "right" }}>

                                                    {/* Render text and list of missing items if items are missing or status is disassembled */}
                                                    {
                                                        asset.incomplete ?
                                                            <Tooltip title={
                                                                <>
                                                                    <Typography variant="caption" style={{ color: "white" }}><b>Missing Items:</b></Typography>
                                                                    <br />
                                                                    {asset.missingItems ? asset.missingItems.map((item, idx) => <React.Fragment key={idx}><Typography variant="caption" style={{ color: "white" }}>{item}</Typography><br /></React.Fragment>) : null}
                                                                </>
                                                            } arrow placement="top">
                                                                <div className={classes.errorDiv}>
                                                                    <ErrorOutlineIcon className={classes.errorIcon} />
                                                                    <Typography variant="caption" className={classes.error}><b>Incomplete</b></Typography>
                                                                </div>
                                                            </Tooltip>

                                                            : null
                                                    }
                                                    <br />
                                                    {
                                                        asset.assembled === false ?
                                                            <div className={classes.errorDiv}>
                                                                <ExtensionIcon className={classes.puzzle} />
                                                                <Typography variant="caption" className={classes.puzzleText}><b>Disassembled</b></Typography>
                                                            </div>
                                                            : null
                                                    }
                                                </div>

                                                {/* List of child components */}
                                                <Manifest
                                                    data={asset}
                                                    onRedirect={handleRedirect} />

                                                {/* Use this page's asset serial and push state to the assembly creator page to modify an existing assembly */}
                                                <Button variant="text" startIcon={<EditIcon />} style={{ float: "left" }} onClick={() => {
                                                    try {
                                                        if (asset.assembled) {
                                                            setWarning(true);
                                                        } else {
                                                            history.push({
                                                                pathname: '/assets/assembly-manager',
                                                                state: {
                                                                    isAssemblyEdit: true,
                                                                    serial: asset.serial,
                                                                    assemblyType: asset.assetName
                                                                }
                                                            })
                                                        }
                                                    } catch {
                                                        history.push({
                                                            pathname: '/assets/assembly-manager',
                                                            state: {
                                                                isAssemblyEdit: true,
                                                                serial: asset.serial,
                                                                assemblyType: asset.assetName
                                                            }
                                                        })
                                                    }
                                                }}>Edit</Button>

                                            </Grid>
                                            : null
                                    }

                                    {/* Display asset timeline */}
                                    <Grid item xs={12} sm={12} md={asset.assetType !== "Assembly" ? 8 : 6} className={asset.assetType !== "Assembly" ? classes.center : classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>Asset Timeline</Typography>
                                        <AssetTimeline
                                            data={events}
                                            onMore={() => setPage(page + 1)}
                                            empty={empty}
                                            onRedirect={handleRedirect} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Warning dialog for when assembly is about to be edited but it is still marked 'assembled' */}
            <AssemblyModificationWarning
                open={warningOpen}
                setOpen={setWarning}
                assembly={asset}
                onError={() => {
                    setAlertInfo({ message: "Couldn't disassemble assembly!", type: "error" });
                    setAlertOpen(true);
                }}
            />

            {/* Alert snackbar for upload or delete response display */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={8000}
                onClose={() => {
                    setAlertInfo({ message: "", type: "" });
                    setAlertOpen(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}>

                <Alert
                    elevation={3}
                    onClose={() => {
                        setAlertInfo({ message: "", type: "" });
                        setAlertOpen(false);
                    }}
                    severity={alertInfo["type"]}>
                    {alertInfo["message"]}
                </Alert>

            </Snackbar>
        </div>
    );
};

export default AssetDetails;