import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

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
    const [assetName, setAssetName] = useState("");
    const [serial, setSerial] = useState("");
    const [owner, setOwner] = useState("");
    const [assignmentType, setAssignmentType] = useState("");
    const [groupTag, setGroupTag] = useState("");
    const [assignee, setAssignee] = useState("");
    const [asset, getAsset] = useState({});

    

    /* Helper method to send update command -- uses async so we can use 'await' keyword */
    const sendData = async (data) => {

        //uses POST endpoint and sends the arguments in the body of the HTTP request
        const result = await fetch("http://localhost:4000/assets", {
            method: "POST",
            mode: 'no-cors',
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
            assetName: assetName,
            serial: serial,
            owner: owner,
            assignmentType: assignmentType,
            groupTag: groupTag,
            assignee: assignee
            
        }

        sendData(data)
        // .then(response => {

        //     //assume anything less than 300 is a success
        //     if (response.status < 300) {
        //         return response.json();
        //     } else return null;
        // })
        .then(json => {

            //check if we got back null and either close dialog on success or setFailed to render error message
            if (json) {
                handleClose();
            } else {
                setFailed(true);
            }
        })
        console.log(data);
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
                        <InputLabel id="asset-type-label">Asset Name</InputLabel>
                        
                        <Select
                            labelId="asset-type-label"
                            labelWidth={105}
                            id="asset-type-label"
                            value={assetName}
                            onChange={(event) => setAssetName(event.target.value)}
                        >
                            <MenuItem value="centralizer">Centralizer</MenuItem>
                            <MenuItem value="gap sub">Gap Sub</MenuItem>
                            <MenuItem value="crossover sub">Crossover Sub</MenuItem>
                            <MenuItem value="carrier">Carrier</MenuItem>
                            {/* populate menu items here for available types */}

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

                            {/* populate menu items here for available serials */}

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
                            <MenuItem value="evolution usa">Evolution-USA</MenuItem>
                            <MenuItem value="evolution canada">Evolution-Calgary</MenuItem>
                            {/* populate menu items here for available owners */}

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
                            <MenuItem value="nabors">Nabors</MenuItem>
                            <MenuItem value="bhge">BHGE</MenuItem>
                            {/* populate menu items here for available customers */}

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