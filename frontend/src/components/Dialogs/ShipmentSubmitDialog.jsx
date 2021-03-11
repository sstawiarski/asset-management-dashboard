import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

//Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import UndoIcon from '@material-ui/icons/Undo';

//Custom Components
import SimpleList from '../Tables/SimpleList';

//Tools
import useLocalStorage from '../../utils/auth/useLocalStorage.hook';

const useStyles = makeStyles(theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
        fontWeight: "bold"
    },
    accordion: {
        backgroundColor: "#EBEBEB"
    },
    accordianDetails: {
        backgroundColor: "#FAFAFA",
        display: "block",
        paddingRight: "5%"
    },
    icon: {
        fontSize: "18px"
    },
    editField: {
        paddingRight: "5px",
        '& input[type="text"]': {
            paddingTop: "1px",
            paddingBottom: "1px",
            fontSize: "16px",
            paddingRight: "5%"
        }
    },
    clearIcon: {
        color: "#B80002",
        fontSize: "18px"
    }
}));

const ShipmentSubmitDialog = ({ open, onSuccess, onFailure, submission, handleCancel }) => {
    const classes = useStyles();

    const [shipmentNotes, setShipmentNotes] = useState("");
    const [shipFrom, setShipFrom] = useState(null);
    const [shipTo, setShipTo] = useState(null);
    const [currentEditing, setCurrentEditing] = useState(null);
    const [shipFromOverrides, setShipFromOverrides] = useState({});
    const [shipToOverrides, setShipToOverrides] = useState({});
    const [tempShipFromOverrides, setTempShipFromOverrides] = useState({});
    const [tempShipToOverrides, setTempShipToOverrides] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [user,] = useLocalStorage('user', {});

    useEffect(() => {
        if (submission.shipFrom) {
            fetch(`http://localhost:4000/locations/${encodeURI(submission.shipFrom["key"])}`)
                .then(res => res.status === 200 ? res.json() : null)
                .then(json => {
                    if (json) {
                        setShipFrom(json);
                        setTempShipFromOverrides({ ...json });
                    }
                });
        }

        if (submission.shipTo) {
            fetch(`http://localhost:4000/locations/${encodeURI(submission.shipTo["key"])}`)
                .then(res => res.status === 200 ? res.json() : null)
                .then(json => {
                    if (json) {
                        setShipTo(json);
                        setTempShipToOverrides({ ...json });
                    }
                });
        }
    }, [submission.shipFrom, submission.shipTo]);

    const handleValueChange = (event, name, location) => {
        const { value } = event.target;
        if (location === "shipFrom") {
            setTempShipFromOverrides(s => ({ ...s, [name]: value }))
        } else if (location === "shipTo") {
            setTempShipToOverrides(s => ({ ...s, [name]: value }))
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        try {
            const submit = {
                assets: submission.assets,
                shipmentType: submission.shipmentType,
                shipFrom: submission.shipFrom.id,
                shipTo: submission.shipTo.id,
                user: user.uniqueId,
                specialInstructions: shipmentNotes,
                shipFromOverrides: Object.keys(shipFromOverrides).length ? shipFromOverrides : null,
                shipToOverrides: Object.keys(shipToOverrides).length ? shipToOverrides : null,
            };

            // TODO: create shipment POST endpoint
            console.log(submit);
            /*
                        fetch("http://localhost:4000/shipments", {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify(submit)
                        }).then(response => {
                            if (response.status < 300) {
                                return response.json();
                            } else {
                                return null;
                            }
                        })
                            .then(json => {
                                if (json) {
                                    onSuccess();
                                } else {
                                    onFailure();
                                }
                                handleCancel();
                            })
            */
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Accordion expand handler
     * Clears current editing key and temporary editing values as well
     */
    const handleExpand = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setCurrentEditing(null);
        setTempShipToOverrides({});
        setTempShipFromOverrides({});
    }

    return (
        <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle>Submit Shipment</DialogTitle>

            <DialogContent>
                <Grid container justify="center" alignItems="flex-start" direction="row">
                    {/* Shipment type */}
                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><b>Type</b></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">{submission.shipmentType}</Typography>
                        <br />
                    </Grid>

                    {/* Ship From Accordion */}
                    <Grid item xs={12}>
                        <Accordion className={classes.accordion} expanded={expanded === 'shipFrom'} onChange={handleExpand('shipFrom')}>

                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="shipFrom-content" id="shipFrom-header">
                                <Typography className={classes.heading}>Ship From</Typography>
                                <Typography>{submission.shipFrom ? submission.shipFrom.name : null}</Typography>
                            </AccordionSummary>

                            <AccordionDetails className={classes.accordianDetails}>
                                {/* Render out all key-value pairs from the location document */}
                                {
                                    shipFrom ?
                                        Object.entries(shipFrom).map(([key, val]) => {
                                            /* Break up key camelCase and capitalize the first letter for a nice label */
                                            const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

                                            /* Exclude "key" and "locationName" values from being overridden by not showing edit button */
                                            if (key === "key" || key === "locationName") {
                                                return (
                                                    <div key={key}>
                                                        <Grid container justify="space-between">
                                                            <Grid item xs={6}>
                                                                <Typography><b>{capitalizedKey}:</b></Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Grid container>
                                                                    <Grid item xs={11}>
                                                                        <Typography>{val}</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                );
                                            } else if (key === "_id" || key === "__v" || key === "coordinates") {

                                                /* For now, exlcude coodinates from even being rendered until we have a way to drop a pin and override them */
                                                return null;
                                            } else {

                                                /* For all other keys, render them out with edit buttons to allow them to be overridden */
                                                return (
                                                    <div key={key}>
                                                        <Grid container justify="space-between">
                                                            <Grid item xs={6}>
                                                                <Typography><b>{capitalizedKey}:</b></Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Grid container>
                                                                    <Grid item xs={9}>
                                                                        {
                                                                            /* Render a textbox whose value is either the current edited value, the previously saved edited value or the original value (in that order depending on existence) 
                                                                             * when the current editing key is equal to this key.
                                                                             *
                                                                             * Otherwise, render either the overriden value if it exists or the value from the original location document.
                                                                             */
                                                                        }
                                                                        {
                                                                            currentEditing === key ?
                                                                                <>
                                                                                    <TextField
                                                                                        className={classes.editField}
                                                                                        variant="outlined"
                                                                                        value={tempShipFromOverrides[key] || shipFromOverrides[key] || shipFrom[key]}
                                                                                        onChange={(event) => handleValueChange(event, key, "shipFrom")} />
                                                                                </>
                                                                                : <Typography>{Object.keys(shipFromOverrides).includes(key) ? shipFromOverrides[key] : val}</Typography>
                                                                        }
                                                                    </Grid>

                                                                    <Grid item xs={2}>
                                                                        {
                                                                            /*
                                                                             * If the current editing key is equal to this key, then render a cancel button next to the newly rendered textbox.
                                                                             *
                                                                             * Otherwise, if the value has been edited (i.e. the key exists in "shipFromOverrides"), render an undo button that removes the override and thus reverts to the original value.
                                                                             */
                                                                        }
                                                                        {
                                                                            currentEditing === key ?

                                                                                <Tooltip title={`Cancel`} placement="top">
                                                                                    <IconButton style={{ padding: "3px" }} onClick={() => {
                                                                                        /* Remove the temporary edit value so the next time the editor is opened it doesn't display the unsaved edit */
                                                                                        setTempShipFromOverrides(s => {
                                                                                            delete s[key];
                                                                                            return { ...s };
                                                                                        });

                                                                                        /* Set editing key to null to revert from textbox to plain text */
                                                                                        setCurrentEditing(null);
                                                                                    }}>
                                                                                        <ClearIcon className={classes.clearIcon} />
                                                                                    </IconButton>
                                                                                </Tooltip>

                                                                                : Object.keys(shipFromOverrides).includes(key) ?
                                                                                    <Tooltip title={`Undo`} placement="top">
                                                                                        <IconButton style={{ padding: "3px" }} onClick={() => {

                                                                                            /* Remove overriden value */
                                                                                            setShipFromOverrides(s => {
                                                                                                delete s[key];
                                                                                                return { ...s };
                                                                                            });
                                                                                        }}>
                                                                                            <UndoIcon className={classes.icon} />
                                                                                        </IconButton>
                                                                                    </Tooltip>

                                                                                    : null
                                                                        }
                                                                    </Grid>

                                                                    <Grid item xs={1}>
                                                                        {
                                                                            /*
                                                                             * If the current editing key is equal to this one, render a save button that stores the new entry in a temporary object 
                                                                             * for use in the textbox onChange which updates the main override object onClick.
                                                                             *
                                                                             * Otherwise, render an edit button that sets the current editing key to this one onClick.
                                                                             */
                                                                        }
                                                                        {
                                                                            currentEditing !== null ?

                                                                                currentEditing === key ?

                                                                                    <Tooltip title={`Save ${capitalizedKey}`} placement="right">
                                                                                        <IconButton style={{ padding: "3px" }} onClick={() => {
                                                                                            setShipFromOverrides(s => {
                                                                                                const tempVal = tempShipFromOverrides[key]; //store textbox value

                                                                                                /* Delete textbox value to clear it out */
                                                                                                setTempShipFromOverrides(t => {
                                                                                                    delete t[key];
                                                                                                    return { ...t };
                                                                                                });

                                                                                                /* Return the override object with the new value set */
                                                                                                return { ...s, [key]: tempVal };
                                                                                            });

                                                                                            setCurrentEditing(null); //turn off editing
                                                                                        }}>
                                                                                            <SaveIcon className={classes.icon} />
                                                                                        </IconButton>
                                                                                    </Tooltip>

                                                                                    : null

                                                                                :

                                                                                <Tooltip title={`Override ${capitalizedKey}`} placement="right">
                                                                                    <IconButton style={{ padding: "3px" }} onClick={() => setCurrentEditing(`${key}`)}>
                                                                                        <EditIcon className={classes.icon} />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                );
                                            }
                                        })
                                        : null
                                }
                            </AccordionDetails>
                        </Accordion>

                        {/* Ship To Accordion */}
                        <Accordion className={classes.accordion} expanded={expanded === 'shipTo'} onChange={handleExpand('shipTo')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="shipTo-content"
                                id="shipTo-header"
                            >
                                <Typography className={classes.heading}>Ship To</Typography>
                                <Typography>{submission.shipTo ? submission.shipTo.name : null}</Typography>
                            </AccordionSummary>
                            <AccordionDetails className={classes.accordianDetails}>
                                {
                                    shipTo ?
                                        Object.entries(shipTo).map(([key, val]) => {
                                            /* Break up key camelCase and capitalize the first letter for a nice label */
                                            const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                                            if (key === "key" || key === "locationName") {
                                                return (
                                                    <div key={key}>
                                                        <Grid container justify="space-between">
                                                            <Grid item xs={6}>
                                                                <Typography><b>{capitalizedKey}:</b></Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Grid container>
                                                                    <Grid item xs={11}>
                                                                        <Typography>{val}</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                );
                                            } else if (key === "_id" || key === "__v" || key === "coordinates") {
                                                return null;
                                            } else {
                                                return (
                                                    <div key={key}>
                                                        <Grid container justify="space-between">
                                                            <Grid item xs={6}>
                                                                <Typography><b>{capitalizedKey}:</b></Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Grid container>
                                                                    <Grid item xs={9}>
                                                                        {
                                                                            currentEditing === key ?
                                                                                <>
                                                                                    <TextField
                                                                                        className={classes.editField}
                                                                                        variant="outlined"
                                                                                        value={tempShipToOverrides[key] || shipToOverrides[key] || shipTo[key]}
                                                                                        onChange={(event) => handleValueChange(event, key, "shipTo")} />
                                                                                </>
                                                                                : <Typography>{Object.keys(shipToOverrides).includes(key) ? shipToOverrides[key] : val}</Typography>
                                                                        }
                                                                    </Grid>
                                                                    <Grid item xs={2}>
                                                                        {
                                                                            currentEditing === key ?
                                                                                <Tooltip title={`Cancel`} placement="top">
                                                                                    <IconButton style={{ padding: "3px" }} onClick={() => {
                                                                                        setTempShipToOverrides(s => {
                                                                                            delete s[key];
                                                                                            return { ...s };
                                                                                        });
                                                                                        setCurrentEditing(null);
                                                                                    }}>
                                                                                        <ClearIcon className={classes.clearIcon} />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                                : Object.keys(shipToOverrides).includes(key) ?
                                                                                    <Tooltip title={`Undo`} placement="top">
                                                                                        <IconButton style={{ padding: "3px" }} onClick={() => {
                                                                                            setShipToOverrides(s => {
                                                                                                delete s[key];
                                                                                                return { ...s };
                                                                                            });
                                                                                        }}>
                                                                                            <UndoIcon className={classes.icon} />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                    : null
                                                                        }

                                                                    </Grid>
                                                                    <Grid item xs={1}>
                                                                        {
                                                                            currentEditing !== null ?

                                                                                currentEditing === key ?
                                                                                    <Tooltip title={`Save ${capitalizedKey}`} placement="right">
                                                                                        <IconButton style={{ padding: "3px" }} onClick={() => {
                                                                                            setShipToOverrides(s => {
                                                                                                const tempVal = tempShipToOverrides[key];
                                                                                                setTempShipToOverrides(t => {
                                                                                                    delete t[key];
                                                                                                    return { ...t };
                                                                                                });
                                                                                                return { ...s, [key]: tempVal };
                                                                                            });
                                                                                            setCurrentEditing(null);
                                                                                        }}>
                                                                                            <SaveIcon className={classes.icon} />
                                                                                        </IconButton>
                                                                                    </Tooltip>

                                                                                    : null
                                                                                : <Tooltip title={`Override ${capitalizedKey}`} placement="right">
                                                                                    <IconButton style={{ padding: "3px" }} onClick={() => setCurrentEditing(`${key}`)}>
                                                                                        <EditIcon className={classes.icon} />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                );
                                            }
                                        })
                                        : null
                                }
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    {/* Shipping manifest display */}
                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        <Typography variant="subtitle1"><b>Manifest</b></Typography>
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        {/* Render manifest list */}
                        {
                            submission.assets ?
                                <SimpleList
                                    data={submission.assets.map(item => {
                                        /* Convert objects to array for use with the SimpleList component, setting quantity to 1 if it is not already set */
                                        const quantity = item.quantity ? item.quantity : 1;
                                        return [item.serial, item.name, quantity, item.notes];
                                    })}
                                    label="assembly-manifest"
                                    headers={["Serial", "Name", "Quantity", "Notes"]} />
                                : null
                        }

                    </Grid>

                    {/* Special instructions header and textbox */}
                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        <Typography variant="subtitle1"><b>Special Instructions</b></Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            multiline
                            variant="outlined"
                            value={shipmentNotes}
                            onChange={(event) => setShipmentNotes(event.target.value)}
                            rows={4}
                            fullWidth />
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} type="submit" color="primary">Submit</Button>
            </DialogActions>
        </Dialog>
    )
};

ShipmentSubmitDialog.propTypes = {
    /**
     * Boolean value determining whether submission dialog is open
     */
    open: PropTypes.bool.isRequired,
    /**
     * Function to run when shipment is successfully created
     */
    onSuccess: PropTypes.func.isRequired,
    /**
     * Function to run when shipment creation fails
     */
    onFailure: PropTypes.func.isRequired,
    /**
     * Object containing list of asset serials, shipFrom and shipTo document IDs, and shipment type
     */
    submission: PropTypes.object,
    /**
     * Function to run when user clicks "Cancel" button on the shipment submission dialog
     */
    handleCancel: PropTypes.func.isRequired
}

export default ShipmentSubmitDialog;