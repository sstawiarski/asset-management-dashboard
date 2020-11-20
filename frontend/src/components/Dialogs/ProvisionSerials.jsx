import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    item: {
        paddingTop: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 180,
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    error: {
        color: "red"
    }
}));

const ProvisionSerials = ({ open, setOpen, selected }) => {
    const classes = useStyles();

    /* Store state of select dropdown */
    const [status, setStatus] = useState("");
    const [failed, setFailed] = useState(null);
    const [assetType, setAssetType] = useState("");
    const [serial, setSerial] = useState("");
    const [owner, setOwner] = useState("");
    const [assignmentType, setAssignmentType] = useState("");
    const [groupTag, setGroupTag] = useState("");
    const [assignee, setAssignee] = useState("");

    /* Helper method to send update command -- uses async so we can use 'await' keyword */
    const sendData = async (data) => {

        //uses PATCH endpoint and sends the arguments in the body of the HTTP request
        const result = await fetch("http://localhost:4000/assets", {
            method: "POST",
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

            //check if we got back null and either close dialog on success or setFailed to render error message
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
        setStatus("");
        setFailed(null);
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="create-asset-dialog-title">
            
            
            <DialogTitle id="create-asset-dialog-title">Create Asset</DialogTitle>
            
            <DialogContent>
                
                
                <div className={classes.item}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="asset-type-label">Asset Type</InputLabel>
                        
                        <Select
                            labelId="asset-type-label"
                            labelWidth={105}
                            id="asset-type-label"
                            value={assetType}
                            onChange={(event) => setAssetType(event.target.value)}
                        >

                            /* populate menu items here for available types */

                        </Select>
   
                    </FormControl>
                
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="serial-numbering-label">Serial Numbers</InputLabel>
                        
                        <Select
                            labelId="serial-numbering-label"
                            labelWidth={105}
                            id="serial-numbering-label"
                            value={serial}
                            onChange={(event) => setSerial(event.target.value)}
                        >

                            /* populate menu items here for available serials */

                        </Select>
         
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl}>
                        
                    <TextField
                                autoFocus
                                margin="dense"
                                label="Asset Quantity"
                                type="text"
                                fullWidth
                                
                            />
         
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

export default ProvisionSerials;