import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
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

const CreateAssetDialog = ({ open, setOpen, selected }) => {
    const classes = useStyles();

    /* Store state of select dropdown */
    const [status, setStatus] = useState("");
    const [failed, setFailed] = useState("");
    const [assetType, setAssetType] = useState("");
    const [serial, setSerial] = useState("");
    const [owner, setOwner] = useState("");
    const [assignmentType, setAssignmentType] = useState("");
    const [groupTag, setGroupTag] = useState("");
    const [assignee, setAssignee] = useState("");
    const [asset, getAsset] = useState({});

    useEffect(() => {
        fetch(`http://localhost:4000/assets/`)
        .then(response => {
            if (response.status < 300) {
                return response.json();
            } else {
                return {};
            }
        })
        .then(json => {
            getAsset(json);
        });

        
    });

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

    const ConsoleLog = ({ children }) => {
        console.log(children);
        return false;
      };

    const handleSubmit = (event) => {
        event.preventDefault();

        //setup data object to send based on API docs and required parameters
        const data = {
            assets: selected,
            
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

    console.log(asset);

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="create-asset-dialog-title">
            
            <ConsoleLog> asset </ConsoleLog>
          
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
                        
                        <TextField
                            margin="dense"
                            id="asset-serial-label"
                            label="Asset Serial"
                            type="text"
                            fullWidth
                            onChange={(event) => setSerial(event.target.value)}
                        >

                            /* populate menu items here for available serials */

                        </TextField>
         
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="asset-owner-label">Asset Owner</InputLabel>
                        
                        <Select
                            labelId="asset-owner-label"
                            labelWidth={105}
                            id="asset-owner-label"
                            value={owner}
                            onChange={(event) => setOwner(event.target.value)}
                        >

                            /* populate menu items here for available serials */

                        </Select>
         
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="assignee-label">Assignee</InputLabel>
                        
                        <Select
                            labelId="assignee-label"
                            labelWidth={105}
                            id="assignee-label"
                            value={assignee}
                            onChange={(event) => setAssignee(event.target.value)}
                        >

                            /* populate menu items here for available serials */

                        </Select>
         
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="assignment-type-label">Assignment Type</InputLabel>
                        
                        <Select
                            labelId="assignment-type-label"
                            labelWidth={105}
                            id="assignment-type-label"
                            value={assignmentType}
                            onChange={(event) => setAssignmentType(event.target.value)}

                        >
                            <MenuItem value="owned">Owned</MenuItem>
                            <MenuItem value="rented">Rented</MenuItem>

                            /* populate menu items here for available serials */

                        </Select>
         
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl}>
                        
                        <TextField
                            
                            margin="dense"
                            id="group-tag-label"
                            label="Group Tag"
                            type="text"
                            fullWidth
                            onChange={(event) => setGroupTag(event.target.value)}
                        >

                            /* populate menu items here for available serials */

                        </TextField>
         
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

export default CreateAssetDialog;