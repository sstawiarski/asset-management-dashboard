import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles'

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
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
    filterList: {
        paddingLeft: "5%"
    },
    autocomplete: {
        marginBottom: "40px",
        padding: "10px"
    },
    subtitle: {
        color: "grey"
    },
    dateContainer: {
        marginTop: "20px"
    }
}));

const ShipmentFilter = ({ open, setOpen, setActiveFilters, disableStatusFilter }) => {
    const classes = useStyles();

    /* All filter state */
    const [state, setState] = useState({
        shipmentType: "all",
        created: null,
        updated: null,
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
        fetch(`${process.env.REACT_APP_API_URL}/locations`)
            .then(res => res.json())
            .then(json => {
                setState(s => ({ ...s, allShippingOptions: json }));
            });
    }, []);

    /* Limit the locations selectable based on shipment type */
    useEffect(() => {
        if (state.shipmentType === "all") {
            setState(s => ({
                ...s,
                shipFromOptions: s.allShippingOptions,
                shipToOptions: s.allShippingOptions
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
        } else {
            setState(s => ({
                ...s,
                shipFromOptions: s.allShippingOptions,
                shipToOptions: s.allShippingOptions
            }));
        }

    }, [state.shipmentType, state.allShippingOptions]);

    const handleClose = () => {
        setOpen(false);
    };

    /* Convert the input values to proper stringified JSON and then send them to the parent */
    const handleSubmit = () => {
        const disallowed = ["all", null, ""];
        const disallowedLabels = ["allShippingOptions", "shipToOptions", "shipFromOptions"];
        const onlyActive = Object.keys(state).filter(label => !disallowedLabels.includes(label))
            .reduce((p, c) => {
                if (!disallowed.includes(state[c])) {
                    if (c === "shipFrom" || c === "shipTo") {
                        p[c] = { id: state[c]._id, name: state[c].key }
                    } else if (state[c] === "Yes") {
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

    /* Handles non-date filter state changes */
    const handleChange = (event) => {
        const { name, value } = event.target

        //clear current selections if type changes
        if (name === "shipmentType") {
            setState(s => ({ ...s, shipTo: null, shipFrom: null, [name]: value }));
        } else {
            setState(s => ({
                ...s,
                [name]: value
            }));
        }
    };

    /* Resets all filter states without removing the fetched location list */
    const handleReset = () => {
        setState(s => ({
            ...s,
            created: null,
            updated: null,
            completed: null,
            status: "all",
            shipFrom: null,
            shipTo: null,
            shipFromOptions: s.allShippingOptions,
            shipToOptions: s.allShippingOptions
        }));
    }

    /* Date filter change handler */
    const handleDateChange = (name, newDate) => {
        setState(s => ({
            ...s,
            [name]: newDate
        }));
    }

    return (
        <Dialog open={open || false} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>{"Filter Shipments"}</DialogTitle>
            <DialogContent>
                <Grid className={classes.filterList} container justify="space-evenly">

                    {/* Filter incoming vs. outgoing shipments */}
                    <Grid item xs={disableStatusFilter ? 12 : 6}>
                        <FormControl component="fieldset">
                            <span>Shipment Type</span>
                            <RadioGroup aria-label="shipment type" name="shipmentType" value={state.shipmentType} onChange={handleChange}>
                                <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                <FormControlLabel value="Incoming" control={<Radio />} label="Incoming" />
                                <FormControlLabel value="Outgoing" control={<Radio />} label="Outgoing" />
                            </RadioGroup>
                        </FormControl>

                    </Grid>



                    {/* Filter by current shipment status */}
                    {
                        !disableStatusFilter &&
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
                    }

                </Grid>

                {/* Shipment location filters with autocomplete and grouping by location type */}
                <Grid className={classes.dateContainer} container justify="space-evenly">
                    <Grid item xs={6}>
                        <Autocomplete
                            id="shipment-from-locator"
                            className={classes.autocomplete}
                            options={state.shipFromOptions}
                            getOptionLabel={(option) => `${option.locationName} (${option.key})`}
                            groupBy={(option) => option.locationType}
                            value={state.shipFrom}
                            onChange={(event, newValue) => setState(s => ({ ...s, shipFrom: newValue }))}
                            renderInput={(params) => <TextField {...params} label="Ship From" variant="outlined" />}
                            renderOption={(option) => {
                                /* Render autocomplete list with subtitles that tell either the operator name, client name, or address */
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
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            id="shipment-to-locator"
                            options={state.shipToOptions}
                            getOptionLabel={(option) => `${option.locationName} (${option.key})`}
                            value={state.shipTo}
                            groupBy={(option) => option.locationType}
                            onChange={(event, newValue) => setState(s => ({ ...s, shipTo: newValue }))}
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
                            renderInput={(params) => <TextField {...params} label="Ship To" variant="outlined" />}
                        />
                    </Grid>

                    {/* Date filters */}
                    <Grid item xs={5}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-evenly">
                                <KeyboardDatePicker

                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    name="created"
                                    inputVariant="outlined"
                                    label="Date Created"
                                    value={state.created}
                                    onChange={date => handleDateChange("created", date)}
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
                                    name="updated"
                                    label="Date Updated"
                                    value={state.updated}
                                    inputVariant="outlined"
                                    onChange={date => handleDateChange("updated", date)}
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
                <Button onClick={handleReset} color="primary">Reset</Button>
                <Button onClick={handleSubmit} color="primary">Filter</Button>
            </DialogActions>

        </Dialog>
    );
};

ShipmentFilter.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func.isRequired,
    setActiveFilters: PropTypes.func.isRequired,
    disableStatusFilter: PropTypes.bool
};

export default ShipmentFilter;
