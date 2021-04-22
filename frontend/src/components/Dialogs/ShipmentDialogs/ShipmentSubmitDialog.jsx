import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

//Custom Components
import SimpleList from '../../Tables/SimpleList';
import LocationAccordion from '../../General/LocationAccordion';

//Tools
import useLocalStorage from '../../../utils/auth/useLocalStorage.hook';

const ShipmentSubmitDialog = ({ open, onSuccess, onFailure, submission, handleCancel }) => {
    const [shipmentNotes, setShipmentNotes] = useState("");
    const [shipFrom, setShipFrom] = useState(null);
    const [shipTo, setShipTo] = useState(null);
    const [shipFromOverrides, setShipFromOverrides] = useState({});
    const [shipToOverrides, setShipToOverrides] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [user,] = useLocalStorage('user', {});

    useEffect(() => {
        if (submission.shipFrom) {
            fetch(`${process.env.REACT_APP_API_URL}/locations/${encodeURI(submission.shipFrom["key"])}`)
                .then(res => res.status === 200 ? res.json() : null)
                .then(json => {
                    if (json) {
                        setShipFrom(json);
                    }
                });
        }

        if (submission.shipTo) {
            fetch(`${process.env.REACT_APP_API_URL}/locations/${encodeURI(submission.shipTo["key"])}`)
                .then(res => res.status === 200 ? res.json() : null)
                .then(json => {
                    if (json) {
                        setShipTo(json);
                    }
                });
        }
    }, [submission.shipFrom, submission.shipTo]);

    const handleSubmit = (event) => {
        try {
            const submit = {
                manifest: submission.assets,
                shipmentType: submission.shipmentType,
                shipFrom: submission.shipFrom.id,
                shipTo: submission.shipTo.id,
                user: user.uniqueId,
                specialInstructions: shipmentNotes,
                override: submission.override || false
            };
            if (Object.keys(shipFromOverrides).length) submit["shipFromOverride"] = shipFromOverrides;
            if (Object.keys(shipToOverrides).length) submit["shipToOverride"] = shipToOverrides;

            /* POST new shipment */
            fetch(`${process.env.REACT_APP_API_URL}/shipments`, {
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
                });

        } catch (e) {
            console.log(e)
            onFailure();
        }
    }

    /**
     * Accordion expand handler
     * Clears current editing key and temporary editing values as well
     */
    const handleExpand = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
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

                    <Grid item xs={12}>
                        {/* Ship From Accordion */}
                        <LocationAccordion
                            name="shipFrom"
                            title="Ship From"
                            onExpand={handleExpand('shipFrom')}
                            expanded={expanded === 'shipFrom'}
                            location={shipFrom}
                            submission={submission}
                            overrides={shipFromOverrides}
                            onUndoOverride={(key) => setShipFromOverrides(s => {
                                delete s[key];
                                return { ...s };
                            })}
                            onOverride={(key, value) => setShipFromOverrides(s => ({ ...s, [key]: value }))}
                        />



                        {/* Ship To Accordion */}
                        <LocationAccordion
                            name="shipTo"
                            title="Ship To"
                            onExpand={handleExpand('shipTo')}
                            expanded={expanded === 'shipTo'}
                            location={shipTo}
                            submission={submission}
                            overrides={shipToOverrides}
                            onUndoOverride={(key) => setShipToOverrides(s => {
                                delete s[key];
                                return { ...s };
                            })}
                            onOverride={(key, value) => setShipToOverrides(s => ({ ...s, [key]: value }))}
                        />

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
                                    data={
                                        submission.assets.map(item => {
                                            /* Convert objects to array for use with the SimpleList component, setting quantity to 1 if it is not already set */
                                            const quantity = item.quantity ? item.quantity : 1;
                                            return [item.serial, item.name, quantity, item.notes];
                                        })
                                    }
                                    label="assembly-manifest"
                                    headers={["Serial", "Name", "Quantity", "Notes"]}
                                />
                                : null
                        }

                    </Grid>

                    {/* Special instructions header and textbox */}
                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        <Typography variant="subtitle1"><b>Special Instructions</b></Typography>
                    </Grid>

                    {/* Shipment notes */}
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