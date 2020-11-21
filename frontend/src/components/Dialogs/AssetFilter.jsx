import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles'
import { Grid, RadioGroup, TextField, FormControl, DialogTitle, DialogContent } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
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
        marginTop: theme.spacing(1),
    },
}));

export default function FormDialog({ open, setOpen, setActiveFilters }) {

    const [state, setState] = React.useState({
        retired: "all",
        dateCreated: null,
        dateUpdated: null,
        assignmentType: "all",
        assetType: "all",
        groupTag: "",
        checkedOut: "all"
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

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
            retired: "all",
            dateCreated: null,
            dateUpdated: null,
            assetType: "all",
            assignmentType: "all",
            groupTag: "",
            checkedOut: "all"
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

            <DialogContent>
                <Grid container justify="space-evenly">
                    <Grid item xs={3}>
                        <FormControl component="fieldset">
                            <span>Status</span>
                            <RadioGroup aria-label="status" name="retired" value={state.retired} onChange={handleChange}>
                                <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                <FormControlLabel value="No" control={<Radio />} label="Active" />
                                <FormControlLabel value="Yes" control={<Radio />} label="Retired" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl component="fieldset">
                            <span>Assignment</span>
                            <RadioGroup aria-label="assignment" name="assignmentType" value={state.assignmentType} onChange={handleChange}>
                                <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                <FormControlLabel value="Owned" control={<Radio />} label="Owned" />
                                <FormControlLabel value="Rental" control={<Radio />} label="Rented" />
                            </RadioGroup>
                        </FormControl>

                    </Grid>
                    <Grid item xs={3}>
                        <FormControl component="fieldset">
                            <span>Type</span>
                            <RadioGroup aria-label="types" name="assetType" value={state.assetType} onChange={handleChange}>
                                <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                <FormControlLabel value="Asset" control={<Radio />} label="Asset" />
                                <FormControlLabel value="Assembly" control={<Radio />} label="Assembly" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl component="fieldset">
                            <span>Checked Out</span>
                            <RadioGroup aria-label="types" name="checkedOut" value={state.checkedOut} onChange={handleChange}>
                                <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container justify="space-evenly" style={{ marginTop: "20px" }}>
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

                </Grid>
                <Grid container justify="space-around" style={{ marginTop: "20px" }}>
                    <Grid item xs={6}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="groupTag"
                            name="groupTag"
                            label="Group Tag"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={state.groupTag}
                            onChange={handleChange}
                        />

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
