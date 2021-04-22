import React from 'react';
import PropTypes from 'prop-types';

import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles'
import { Grid, FormControl, DialogTitle } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({

    form: {
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto',
        width: 'fit-content',
    },

    formControl: {
        marginTop: theme.spacing(1),
        minWidth: 400,
    },
    formControlLabel: {
        margin: theme.spacing(1),
    },
    items: {
        padding: theme.spacing(5),
        marginTop: "-30px"
    },
    select: {
        width: "300px",
        marginBottom: "20px",
    }
}));


//TODO: Add support for filtering based on products that event applies to
export default function FormDialog({ open, setOpen, setActiveFilters }) {

    const [state, setState] = React.useState({
        eventTime: null,
        eventType: "all"
    })

    const handleClose = () => {
        setOpen(false);
    };

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
    }

    const handleReset = () => {
        setState(s => ({
            ...s,
            eventTime: null,
            eventType: "all"
        }))
    }

    const handleDateChange = (name, newDate) => {
        setState(s => ({
            ...s,
            [name]: newDate
        }))
    }


    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>{"Filter Assets"}</DialogTitle>
            <Grid container alignContent="space-between">
                <div className={classes.items}>

                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <formLabel component="legend" className={classes.formControlLabel}>Event Type</formLabel>
                            <Select className={classes.select} name="eventType" variant="outlined" value={state.eventType} onChange={handleChange}>
                                <MenuItem value={"all"}>All</MenuItem>
                                <MenuItem value={"Change of Ownership"}>Change of Ownership</MenuItem>
                                <MenuItem value={"Change of Retirement Status"}>Change of Retirement Status</MenuItem>
                                <MenuItem value={"Change of Group Tag"}>Change of Group Tag</MenuItem>
                                <MenuItem value={"Change of Assignment Type"}>Change of Assignment Type</MenuItem>
                                <MenuItem value={"Reassignment"}>Reassignment</MenuItem>
                                <MenuItem value={"Removal of Child Asset"}>Removal of Child Asset</MenuItem>
                                <MenuItem value={"Outgoing Shipment"}>Outgoing Shipment</MenuItem>
                                <MenuItem value={"Incoming Shipment"}>Incoming Shipment</MenuItem>
                                <MenuItem value={"Creation"}>Creation</MenuItem>
                                <MenuItem value={"Assembly Creation"}>Assembly Creation</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <formLabel component="legend" className={classes.formControlLabel}>Event Date</formLabel>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-evenly">
                                    <KeyboardDatePicker
                                        inputVariant="outlined"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        name="eventTime"
                                        value={state.eventTime}
                                        onChange={date => handleDateChange("eventTime", date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </FormControl>

                    </Grid>
                </div>
            </Grid>
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
};

FormDialog.propTypes = {
    setOpen: PropTypes.func,
    open: PropTypes.bool,
    setActiveFilters: PropTypes.func
};
