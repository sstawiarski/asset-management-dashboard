import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

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
    const [assetQuantity, setAssetQuantity] = useState("");
    const data = {
        assetType: assetType,
        serial: serial,
        assetQuantity: assetQuantity
    }
  

    /* Helper method to send update command -- uses async so we can use 'await' keyword */
    const sendData = async (data) => {

        //uses POST endpoint and sends the arguments in the body of the HTTP request
        const result = await fetch("http://localhost:4000/assets/provision", {
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
        <Dialog open={open} onClose={handleClose} aria-labelledby="provision-serial-dialog-title">
            
            
            <DialogTitle id="provision-serial-dialog-title">Provision Serials</DialogTitle>
            
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
                            <MenuItem value="Centralizer">Centralizer</MenuItem>
                            <MenuItem value="Gap Sub">Gap Sub</MenuItem>
                            <MenuItem value="Crossover Sub">Crossover Sub</MenuItem>
                            <MenuItem value="Carrier">Carrier</MenuItem>

                            {/* populate menu items here for available types */}

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

                            <MenuItem value="Sequential">Sequential</MenuItem>
                            <MenuItem value="Back fill">Back Fill</MenuItem>
                        

                        </Select>
         
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl}>
                        
                        <TextField
                                    
                                    margin="dense"
                                    id="asset-quantity"
                                    label="Asset Quantity"
                                    type="text"
                                    fullWidth
                                    onChange={(event) => setAssetQuantity(event.target.value)}
                                
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