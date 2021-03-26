import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useLocalStorage from '../../utils/auth/useLocalStorage.hook';

const useStyles = makeStyles((theme) => ({
    item: {
        paddingTop: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 180,
    },
    error: {
        color: "red"
    }
}));

const ChangeStatusDialog = ({ open, setOpen, selected, onSuccess, override }) => {
    const classes = useStyles();

    /* Store state of select dropdown */
    const [status, setStatus] = useState("");
    const selectedFields = ['completed', 'staging', 'abandoned'];
    const [user, ] = useLocalStorage('user', {});

    /* Helper method to send update command -- uses async so we can use 'await' keyword */
    const sendData = async (data) => {

        //uses PATCH endpoint and sends the arguments in the body of the HTTP request
        const result = await fetch(`${process.env.REACT_APP_API_URL}/shipments`, {
            method: "PATCH",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return result;
    }

    const handleSubmit = (event) => {

        event.preventDefault();

        const data = {
            shipments: selected,
            update: {
                status: status
            },
            override: override,
            user: user.uniqueId
        }

        sendData(data)
            .then(response => {

                //assume anything less than 300 is a success
                if (response.status < 300) {
                    return response.json();
                } else return null;
            })
            .then(json => {

                //check if we got back null and send response to parent page for snackbar rendering
                if (json) {
                    const newStatus = status;
                    handleClose();
                    onSuccess(true, `Successfully updated ${selected.length} shipment(s) status to ${newStatus}! Event Key: ${json.key}`)
                } else {
                    handleClose();
                    onSuccess(false, `Failed to update asset owner...`);
                }
            })
    }

      //reset dialog to default state on close
    const handleClose = () => {
        setOpen(false);
        setStatus("");
    }

    

  

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="change-status-dialog-title">

            <DialogTitle id="change-status-dialog-title">Change Status</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Changing Status of {selected.length} product{selected.length > 1 ? "s" : ""}
                </DialogContentText>

                <div className={classes.item}>
                    <Autocomplete
                        id="status-dropdown"
                        options={selectedFields}
                        autoHighlight
                        onChange={(event, newValue) => setStatus(newValue)}
                        renderInput={(selectedFields) => <TextField {...selectedFields} label="Status" variant="outlined" />}
                    />
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} type="submit" color="primary">
                    Submit
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default ChangeStatusDialog;