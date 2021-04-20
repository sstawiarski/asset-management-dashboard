import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
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

const ChangeGroupTagDialog = ({ open, setOpen, selected, onSuccess, override }) => {
    const classes = useStyles();

    /* Store state of select dropdown */
    const [groupTag, setGroupTag] = useState("");
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
                groupTag: groupTag
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
                    const tag = groupTag;
                    handleClose();
                    onSuccess(true, `Successfully changed ${selected.length} asset(s) group tag to ${tag}! Event Key: ${json.key}`)
                } else {
                    handleClose();
                    onSuccess(false, `Failed to change group tag...`)
                }
            })
    }

    //reset dialog to default state on close
    const handleClose = () => {
        setOpen(false);
        setGroupTag("");
    }

    return (
        <Dialog open={open || false} onClose={handleClose} aria-labelledby="change-grouptag-dialog-title">

            <DialogTitle id="change-grouptag-dialog-title">Change Group Tag</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Changing the group tag of {selected.length} product{selected.length > 1 ? "s" : ""}
                </DialogContentText>

                <div className={classes.item}>
                    <form>
                        {/* Controlled input, get value from state and changes state when it changes */}
                        <TextField
                            id="group-tag-editor"
                            label="Group Tag"
                            variant="outlined"
                            value={groupTag}
                            onChange={(event) => setGroupTag(event.target.value)} />
                    </form>
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

ChangeGroupTagDialog.propTypes = {
    open: PropTypes.bool, 
    setOpen: PropTypes.func, 
    selected: PropTypes.array, 
    onSuccess: PropTypes.func, 
    override: PropTypes.bool 
};

export default ChangeGroupTagDialog;