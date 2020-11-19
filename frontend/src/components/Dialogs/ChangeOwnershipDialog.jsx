import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

const ChangeOwnershipDialog = ({ open, setOpen, selected }) => {
    const classes = useStyles();

    /* Store state of select dropdown */
    const [status, setStatus] = useState("");
    const [failed, setFailed] = useState(null);
    const [owner, setOwner] = useState("");
    const [dropdown, setDropdown] = useState([]);

    /* Helper method to send update command -- uses async so we can use 'await' keyword */
    const sendData = async (data) => {

        //uses PATCH endpoint and sends the arguments in the body of the HTTP request
        const result = await fetch("http://localhost:4000/assets", {
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

        //setup data object to send based on API docs and required parameters
        const data = {
            assets: selected,
            update: {
                owner: owner
            }
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
                    handleClose();
                } else {
                    setFailed(true);
                }
            })
    }

    //reset dialog to default state on close
    const handleClose = () => {
        setOpen(false);
        setOwner("");
        setStatus("");
        setFailed(null);
    }

    useEffect(() => {
        fetch('http://localhost:4000/customers')
        .then(response => {
            if (response.status < 300) {
                return response.json();
            } else {
                return [];
            }
        })
        .then(json => setDropdown(json));
    }, [])

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="change-assignee-dialog-title">

            <DialogTitle id="change-assignee-dialog-title">Change Assignee</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Changing the Owner of {selected.length} product{selected.length > 1 ? "s" : ""}
                </DialogContentText>

                <div className={classes.item}>

                    <Autocomplete
                        id="owner-dropdown"
                        options={dropdown.map(customer => customer.companyName)}
                        autoHighlight
                        onChange={(event, newValue) => setOwner(newValue)}
                        renderInput={(params) => <TextField {...params} label="Owners" variant="outlined" />}
                    />

                    {/* Render a failure message if API returns a response code > 300 */}
                    {failed ? <Typography variant="subtitle1" className={classes.error}>Error submitting change</Typography> : null}
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

export default ChangeOwnershipDialog;