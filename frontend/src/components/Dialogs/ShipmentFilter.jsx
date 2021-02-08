import React, { useState, useEffect } from 'react';

//Library Tools
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const ShipmentFilter = ({ open, setOpen, setActiveFilters }) => {

    const [state, setState] = useState({
        shipmentType: "all",
        dateCreated: null,
        dateUpdated: null,
        completed: null,
        status: "all",
        shipFrom: null,
        shipTo: null,
        shipFromOptions: [],
        shipToOptions: [],
        allShippingOptions: []
    });

    /* Get available shipment locations */
    useEffect(() => {

    }, [])

    /* Limit the locations selectable based on shipment type */
    useEffect(() => {
        if (state.shipmentType === "all") {
            setState(s => ({...s, shipFromOptions: s.allShippingOptions, shipToOptions: s.allShippingOptions}));
        } else if (state.shipmentType === "Incoming") {
            setState(s => ({...s, shipFromOptions: s.allShippingOptions, shipToOptions: s.allShippingOptions.filter(obj => obj.type === "Staging Facility")}));
        } else if (state.shipmentType === "Outgoing") {
            setState(s => ({...s, shipToOptions: s.allShippingOptions, shipFromOptions: s.allShippingOptions.filter(obj => obj.type === "Staging Facility")}));
        }
    }, [state.shipmentType])

    const handleClose = () => {
        setOpen(false);
    };

    /* Convert the input values to proper stringified JSON and then send them to the parent */
    const handleSubmit = () => {
        const disallowed = ["all", null, ""];
        const onlyActive = Object.keys(state)
            .reduce((p, c) => {
                if (!disallowed.includes(state[c])) {
                    if (state[c] === "Yes") {
                        p[c] = true;
                    } else if (state[c] === "No") {
                        p[c] = false;
                    } else {
                        p[c] = state[c];
                    }
                };
                return p;
            }, {})

        setActiveFilters(s => (onlyActive));
        setOpen(false);
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setState(s => ({
            ...s,
            [name]: value
        }));

    };

    const handleReset = () => {
        setState(s => ({
            ...s,
            shipmentType: "all",
            dateCreated: null,
            dateUpdated: null,
            completed: null,
            status: "all",
            shipFrom: null,
            shipTo: null,
            shipFromOptions: [],
            shipToOptions: []
        }));
    }

    const handleDateChange = (name, newDate) => {
        setState(s => ({
            ...s,
            [name]: newDate
        }))
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>{"Filter Shipments"}</DialogTitle>

            <DialogContent>
                <Grid container justify="space-between" style={{ paddingLeft: "20%" }}>


                    <Grid item xs={6}>
                        <FormControl component="fieldset">
                            <span>Shipment Type</span>
                            <RadioGroup aria-label="shipment type" name="shipmentType" value={state.shipmentType} onChange={handleChange}>
                                <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                <FormControlLabel value="Incoming" control={<Radio />} label="Incoming" />
                                <FormControlLabel value="Outgoing" control={<Radio />} label="Outgoing" />
                            </RadioGroup>
                        </FormControl>

                    </Grid>

                    <Grid item xs={6}>
                        <FormControl component="fieldset">
                            <span>Status</span>
                            <RadioGroup aria-label="status" name="status" value={state.status} onChange={handleChange}>
                                <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                <FormControlLabel value="Staging" control={<Radio />} label="Staging" />
                                <FormControlLabel value="Completed" control={<Radio />} label="Completed" />
                                <FormControlLabel value="Abandoned" control={<Radio />} label="Abandoned" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container justify="space-evenly" style={{ marginTop: "20px" }}>
                    {/* TODO: Change to grouped by type of location */}
                    <Grid item xs={6}>
                        <Autocomplete
                            id="shipment-from-locator"
                            options={state.shipFromOptions}
                            value={state.shipFrom}
                            onChange={(event, newValue) => setState(s => ({...s, shipFrom: newValue}))}
                            style={{ marginBottom: "40px", paddingRight: "20px" }}
                            renderInput={(params) => <TextField {...params} label="Ship From" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            id="shipment-to-locator"
                            options={state.shipToOptions}
                            value={state.shipTo}
                            onChange={(event, newValue) => setState(s => ({...s, shipTo: newValue}))}
                            style={{ marginBottom: "40px" }}
                            renderInput={(params) => <TextField {...params} label="Ship To" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-evenly">
                                <KeyboardDatePicker

                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    name="dateCreated"
                                    inputVariant="outlined"
                                    label="Date Created"
                                    value={state.dateCreated}
                                    onChange={date => handleDateChange("dateCreated", date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item xs={5}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-evenly">
                                <KeyboardDatePicker
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    name="dateUpdated"
                                    label="Date Updated"
                                    value={state.dateUpdated}
                                    inputVariant="outlined"
                                    onChange={date => handleDateChange("dateUpdated", date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}

                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item xs={5}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-evenly">
                                <KeyboardDatePicker

                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    name="completed"
                                    inputVariant="outlined"
                                    label="Date Completed"
                                    value={state.completed}
                                    onChange={date => handleDateChange("completed", date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Grid>

                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleReset} color="primary">
                    Reset
          </Button>
                <Button onClick={handleSubmit} color="primary">
                    Filter
          </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShipmentFilter;
