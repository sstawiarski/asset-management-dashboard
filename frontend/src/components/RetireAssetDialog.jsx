import React, { useState } from 'react';

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
import { Typography } from '@material-ui/core';

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

const RetireAssetDialog = ({ open, setOpen, assets }) => {
    const classes = useStyles();

    const [status, setStatus] = useState("");
    const [failed, setFailed] = useState(null);

    const sendData = async (data) => {
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

        const data = {
            assets: assets,
            update: {
                retired: status === "Active" ? false : true
            }
        }

        sendData(data)
        .then(response => {
            if (response.status < 300) {
                return response.json();
            } else return null;
        })
        .then(json => {
            if (json) {
                console.log(json);
            } else {
                setFailed(true);
            }
        })
    }

    const handleClose = () => {
        setOpen(false);
        setStatus("");
        setFailed(null);
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="change-status-dialog-title">
            <DialogTitle id="change-status-dialog-title">Change Product Status</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Changing the activity status of {assets.length} product{assets.length > 1 ? "s" : "" }
                </DialogContentText>
                <div className={classes.item}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="product-status-label">Product Status</InputLabel>
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
                        {failed ? <Typography variant="subtitle1" className={classes.error}>Error submitting change</Typography> : null}
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

export default RetireAssetDialog;