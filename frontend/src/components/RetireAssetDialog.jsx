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

const useStyles = makeStyles((theme) => ({
    item: {
        paddingTop: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 180,
    }
}));

const RetireAssetDialog = ({ open, setOpen, assets }) => {
    const classes = useStyles();

    const [status, setStatus] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="change-status-dialog-title">
            <DialogTitle id="change-status-dialog-title">Change Product Status</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Changing the activity status of {assets.length} products
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
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
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