import React, { useState } from 'react';

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
import SimpleList from '../Tables/SimpleList';

//Tools
import useLocalStorage from '../../utils/auth/useLocalStorage.hook';

const ShipmentSubmitDialog = ({ open, onSuccess, onFailure, submission, handleCancel }) => {

    const [shipmentNotes, setShipmentNotes] = useState("");
    const [user,] = useLocalStorage('user', {});

    const handleSubmit = (event) => {
        event.preventDefault();

        try {
            const submit = {
                assets: submission.assets,
                shipmentType: submission.shipmentType,
                shipFrom: submission.shipFrom.id,
                shipTo: submission.shipTo.id,
                user: user.uniqueId,
                specialInstructions: shipmentNotes
            };

            // TODO: create shipment POST endpoint
            console.log(submit);
            /*
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
                            })
            */
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">

            <DialogTitle>Submit Shipment</DialogTitle>

            <DialogContent>
                <Grid container justify="center" alignItems="flex-start" direction="row">
                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><b>Type</b></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">{submission.shipmentType}</Typography>
                        <br />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><b>Ship From</b></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">{submission.shipFrom ? submission.shipFrom.name : null} ({submission.shipFrom ? submission.shipFrom.key : null})</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><b>Ship To</b></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">{submission.shipTo ? submission.shipTo.name : null} ({submission.shipTo ? submission.shipTo.key : null})</Typography>
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        <Typography variant="subtitle1"><b>Manifest</b></Typography>
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        {
                            submission.assets ?
                                <SimpleList data={submission.assets.map(item => {
                                    const quantity = item.quantity ? item.quantity : 1;

                                    return [item.serial, item.name, quantity, item.notes];
                                })} label="assembly-manifest" headers={["Serial", "Name", "Quantity", "Notes"]} />
                                : null
                        }

                    </Grid>

                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        <Typography variant="subtitle1"><b>Special Instructions</b></Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField multiline variant="outlined" value={shipmentNotes} onChange={(event) => setShipmentNotes(event.target.value)} rows={4} fullWidth />
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
          </Button>
                <Button onClick={handleSubmit} type="submit" color="primary">
                    Submit
          </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShipmentSubmitDialog;