import React, { useState, useEffect } from 'react';
import uuid from 'react-uuid'
import PropTypes from 'prop-types';

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField'

const AddUnserializedDialog = ({ open, onClose, onSubmit }) => {

    const [state, setState] = useState({
        name: "",
        quantity: "",
        notes: "",
        uuid: ""
    });

    const [nameError, setNameError] = useState(false);
    const [quantityError, setQuantityError] = useState({ 
        error: false,
        message: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "name") {
            setNameError(false);
        } else if (name === "quantity") {
            setQuantityError(s => ({ ...s, error: false, message: "" }));
        }
        setState(s => ({ ...s, [name]: value}));
    }

    const handleCancel = () => {
        setState({
            name: "",
            quantity: "",
            notes: "",
            uuid: ""
        });
        setNameError(false);
        setQuantityError({ 
            error: false,
            message: ""
        });
        onClose();
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let errorFound = false;
        if (state.name === "") {
            setNameError(true);
            errorFound = true;
        }
        
        if (state.quantity === "") {
            setQuantityError(s => ({ ...s, error: true, message: "ERROR: Quantity required" }));
            errorFound = true;
        }

        if (!state.quantity.match(new RegExp(/^[0-9]*$/))) {
            setQuantityError(s => ({ ...s, error: true, message: "ERROR: Quantity must be a number" }));
            errorFound = true;
        }

        if (errorFound) return;

        const curState = { serial: "N/A", ...state };
        onSubmit(curState)
        setState({
            name: "",
            quantity: "",
            notes: "",
            uuid: ""
        });
        setNameError(false);
        setQuantityError({ 
            error: false,
            message: ""
        });
    }

    useEffect(() => {
        if (open) {
            setState(s => ({ ...s, uuid: uuid()}));
        }
    }, [open])

    return (
        <Dialog open={open || false} onClose={onClose}>
            <DialogTitle>
                Add Unserialized Item
    </DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant="body1"><b>Name</b></Typography>
                        <TextField name="name" value={state.name} variant="outlined" onChange={handleChange} error={nameError} />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1"><b>Quantity</b></Typography>
                        <TextField name="quantity" value={state.quantity} variant="outlined" onChange={handleChange} error={quantityError.error} />
                        { quantityError.error ? <Typography variant="body2" style={{ color: "red" }}>{quantityError.message}</Typography> : null }
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "5%" }}>
                        <Typography variant="body1"><b>Notes</b></Typography>
                        <TextField name="notes" value={state.notes} fullWidth multiline rows={3} variant="outlined" onChange={handleChange}/>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleCancel}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

AddUnserializedDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func
}

export default AddUnserializedDialog;