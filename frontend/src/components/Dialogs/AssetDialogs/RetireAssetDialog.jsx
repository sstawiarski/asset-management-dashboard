import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import useLocalStorage from '../../../utils/auth/useLocalStorage.hook';

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

const RetireAssetDialog = ({ open, setOpen, selected, onSuccess, override }) => {
    const classes = useStyles();

    /* Store state of select dropdown */
    const [status, setStatus] = useState("");
    const [user, ] = useLocalStorage('user', {});

    /* Helper method to send update command -- uses async so we can use 'await' keyword */
    const sendData = async (data) => {

        //uses PATCH endpoint and sends the arguments in the body of the HTTP request
        const result = await fetch(`${process.env.REACT_APP_API_URL}/assets`, {
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
                retired: status === "Active" ? false : true
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

            //check if we got back null and either close dialog on success or setFailed to render error message
            if (json) {
                handleClose();
                onSuccess(true, `Successfully retired ${selected.length} asset(s)! Event Key: ${json.key}`)
            } else {
                handleClose();
                onSuccess(false,`Failed to retire asset(s)...`);
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
            
            <DialogTitle id="change-status-dialog-title">Change Product Status</DialogTitle>
            
            <DialogContent>
                <DialogContentText>
                    Changing the activity status of {selected.length} product{selected.length > 1 ? "s" : "" }
                </DialogContentText>
                
                <div className={classes.item}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="product-status-label">Product Status</InputLabel>

                        {/* Controlled select, get value from state and changes state when it changes */}
                        <Select
                            labelId="product-status-label"
                            labelWidth={105}
                            id="product-status-select"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                        >

                            <MenuItem value={"Active"}>Active</MenuItem>
                            <MenuItem value={"Retired"}>Retired</MenuItem>

                        </Select>
                    </FormControl>
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

RetireAssetDialog.propTypes = {
    open: PropTypes.func, 
    setOpen: PropTypes.func, 
    selected: PropTypes.array, 
    onSuccess: PropTypes.func, 
    override: PropTypes.bool
};

export default RetireAssetDialog;