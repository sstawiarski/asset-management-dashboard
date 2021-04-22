import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogActions from '@material-ui/core/DialogActions';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
    autocomplete: {
        marginTop: "15px",
        padding: "0px 5px 0px 0px"
    },
    form: {
        marginTop: theme.spacing(2),
        width: "98%"
    },
    formItem: {
        marginTop: theme.spacing(1)
    }
}))

const CreateNewShipmentDialog = ({ creatorOpen, handleCreate, handleCancel }) => {
    const classes = useStyles();
    const [missingType, setMissingType] = useState(false);
    const [missingFrom, setMissingFrom] = useState(false);
    const [missingTo, setMissingTo] = useState(false);

    const [state, setState] = useState({
        shipFrom: null,
        shipTo: null,
        shipmentType: "",
        shipFromOptions: [],
        shipToOptions: [],
        allShippingOptions: [],
        newFromOption: null,
        newToOption: null
    })

    useEffect(() => {
        if (creatorOpen) {
            fetch(`${process.env.REACT_APP_API_URL}/locations`)
                .then(res => res.json())
                .then(json => {
                    setState(s => ({ ...s, allShippingOptions: json }));
                });
        }
    }, [creatorOpen]);

    /* Limit the locations selectable based on shipment type */
    useEffect(() => {
        if (state.shipmentType === "") {
            setState(s => ({
                ...s,
                shipFromOptions: [],
                shipToOptions: []
            }));
        } else if (state.shipmentType === "Incoming") {
            setState(s => ({
                ...s,
                shipFromOptions: s.allShippingOptions,
                shipToOptions: s.allShippingOptions.filter(obj => obj.locationType === "Staging Facility")
            }));
        } else if (state.shipmentType === "Outgoing") {
            setState(s => ({
                ...s,
                shipToOptions: s.allShippingOptions,
                shipFromOptions: s.allShippingOptions.filter(obj => obj.locationType === "Staging Facility")
            }));
        }
    }, [state.shipmentType]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setState(s => ({
            ...s,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (state.shipmentType === "") {
            setMissingType(true);
            return;
        }
        if (state.shipFrom === "") {
            setMissingFrom(true);
            return;
        }
        if (state.shipTo === "") {
            setMissingTo(true);
            return;
        }
        handleCreate(state);
        setState({
            shipFrom: null,
            shipTo: null,
            shipmentType: "",
            newFromOption: null,
            newToOption: null,
            shipFromOptions: [],
            shipToOptions: [],
            allShippingOptions: []
        })
    }

    return (
        <Dialog onClose={handleCancel} onSubmit={handleSubmit} open={creatorOpen} fullWidth>
            <DialogTitle>Start New Shipment</DialogTitle>

            <DialogContent>
                <Grid container direction="row">
                    <Grid item xs={12}>
                        <FormControl variant="outlined" style={{ width: "50%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
                            <InputLabel id="type-label">Shipment Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                name="shipmentType"
                                fullWidth
                                labelWidth={110}
                                value={state.shipmentType}
                                onChange={(event) => {
                                    if (missingType) {
                                        setMissingType(false)
                                    }
                                    console.log("ShipType" + state.shipmentType)
                                    handleChange(event)
                                }}
                                error={missingType}
                            >

                                <MenuItem value="Incoming">Incoming</MenuItem>
                                <MenuItem value="Outgoing">Outgoing</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} className={classes.autocomplete}>
                        <Autocomplete
                            id="shipment-from-locator"
                            options={state.shipFromOptions}
                            getOptionLabel={(option) => `${option.locationName} (${option.key})`}
                            value={state.shipFrom}
                            fullWidth
                            groupBy={(option) => option.locationType}
                            onChange={(event, newValue) => {
                                if (missingFrom) {
                                    setMissingFrom(false)
                                }
                                console.log("shipFrom" + state.shipFrom)
                                setState(s => ({ ...s, shipFrom: newValue }))
                            }}

                            className={classes.autocomplete}
                            renderOption={(option) => {
                                return (
                                    <>
                                        <div>
                                            {option.locationName} {`(${option.key})`}
                                            <Typography className={classes.subtitle} variant="subtitle2">
                                                {
                                                    option.operator ?
                                                        option.operator
                                                        : option.client ?
                                                            option.client
                                                            : option.address ?
                                                                option.address
                                                                : null
                                                }
                                            </Typography>
                                        </div>
                                    </>
                                )
                            }}
                            renderInput={(params) => <TextField {...params} label="Ship From" variant="outlined" error={missingFrom} />}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.autocomplete}>
                        <Autocomplete
                            id="shipment-to-locator"
                            options={state.shipToOptions}
                            getOptionLabel={(option) => `${option.locationName} (${option.key})`}
                            value={state.shipTo}
                            fullWidth
                            groupBy={(option) => option.locationType}
                            onChange={(event, newValue) => {
                                if (missingTo) {
                                    setMissingTo(false)
                                }
                                setState(s => ({ ...s, shipTo: newValue }))
                            }}
                            error={missingTo}
                            className={classes.autocomplete}
                            renderOption={(option) => {
                                return (
                                    <>
                                        <div>
                                            {option.locationName} {`(${option.key})`}
                                            <Typography className={classes.subtitle} variant="subtitle2">
                                                {
                                                    option.operator ?
                                                        option.operator
                                                        : option.client ?
                                                            option.client
                                                            : option.address ?
                                                                option.address
                                                                : null
                                                }
                                            </Typography>
                                        </div>
                                    </>
                                )
                            }}
                            renderInput={(params) => <TextField {...params} label="Ship To" variant="outlined" error={missingTo} />}
                        />
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button className={classes.button} onClick={() => {
                    handleCancel();
                    setState({
                        shipFrom: null,
                        shipTo: null,
                        shipmentType: "",
                        newFromOption: null,
                        newToOption: null
                    });
                }}>Cancel</Button>
                <Button className={classes.button} onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

CreateNewShipmentDialog.propTypes = {
    /** Whether the dialog is open */
    creatorOpen: PropTypes.bool,
    /** Callback to run when shipment is started */
    handleCreate: PropTypes.func,
    /** Callback to run when user cancels the initialization process */
    handleCancel: PropTypes.func
}

export default CreateNewShipmentDialog;