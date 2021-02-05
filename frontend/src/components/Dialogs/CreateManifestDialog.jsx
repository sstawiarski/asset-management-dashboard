import React, { useState, useEffect } from 'react';

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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const useStyles = makeStyles((theme) => ({
    item: {
    },
    formControl: {
        marginBottom: theme.spacing(2),
        minWidth: 180,
        marginLeft: "20px"
    },
    entry: {
        marginLeft: "20px"
    },
    error: {

    },
    range: {
        marginLeft: "20px",
        width: "40%"
    },
    owner: {
        marginBottom: theme.spacing(2),
        minWidth: 240,
        marginLeft: "20px",
        marginTop: theme.spacing(4)
    },
}));



const CreateManifestDialog = ({ open, setOpen, onSuccess, onSemiSuccess }) => {
    const classes = useStyles();

    const [createdBy, setCreatedBy] = useState("");
    const [created, setCreated] = useState("");
    const [updated, setUpdated] = useState("");
    const [completed, setCompleted] = useState("");
    const [status, setStatus] = useState("");
    const [shipmentType, setShipmentType] = useState("");
    const [shipFrom, setShipFrom] = useState("");
    const [shipTo, setShipTo] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [contractId, setContractId] = useState("");
    const [manifest, setManifest] = useState("");

    const handleClose = () => {
        setOpen(false);
     
    }

    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose} aria-labelledby="create-manifest-dialog-title">



            <DialogTitle id="create-manifest-dialog-title">Create Manifests</DialogTitle>

            <DialogContent>

                <ToggleButtonGroup
                    exclusive
                    aria-label="text alignment"
                >
                    <ToggleButton value="left" aria-label="Incoming">
                        
                    </ToggleButton>
                    
                    <ToggleButton value="right" aria-label="Outgoing">

                    </ToggleButton>

                  

                </ToggleButtonGroup>
    


                
                            
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleClose} type="submit" color="primary">
                    Submit
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default CreateManifestDialog;