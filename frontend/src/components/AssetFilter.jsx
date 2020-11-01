import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles'
import { Grid, RadioGroup, TextField, FormControl, Checkbox, DialogTitle } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';


import Header from './Header'


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



export default function FormDialog({ open, setOpen, setSelected }) {

    const [state, setState] = React.useState({
        status: "all",
        dateCreated: null,
        dateUpdated: null,
        assignmentType: "all",
        assetType: "all",
        groupTag: ""
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
            if (!disallowed.includes(state[c])) p[c] = state[c];
            return p;
        }, {})

        setSelected(onlyActive);

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
            status: "all",
            dateCreated: null,
            dateUpdated: null,
            assetType: "all",
            assignmentType: "all",
            groupTag: ""
        }))
    }

    const handleDateChange = (name, newDate) => {
        setState(s => ({
            ...s,
            [name]: newDate
        }))
    }


    const classes = (useStyles);




    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>{"Filter Assets"}</DialogTitle>
            <Grid container alignContent="space-around" alignItems="center">
                <div>
                    <Grid container justify="space-around">
                        <Grid item xs={3}>
                            <FormControl component="fieldset">
                                <formLabel compoonent="legend">Status</formLabel>
                                <RadioGroup aria-label="status" name="status" value={state.status} onChange={handleChange}>
                                    <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                                    <FormControlLabel value="retired" control={<Radio />} label="Retired" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl component="fieldset">
                                <formLabel compoonent="legend">Assignment</formLabel>
                                <RadioGroup aria-label="assignment" name="assignmentType" value={state.assignmentType} onChange={handleChange}>
                                    <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                    <FormControlLabel value="owned" control={<Radio />} label="Owned" />
                                    <FormControlLabel value="rented" control={<Radio />} label="Rented" />
                                </RadioGroup>
                            </FormControl>

                        </Grid>
                        <Grid item xs={3}>
                            <FormControl component="fieldset">
                                <formLabel compoonent="legend">Type</formLabel>
                                <RadioGroup aria-label="types" name="assetType" value={state.assetType} onChange={handleChange}>
                                    <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                    <FormControlLabel value="asset" control={<Radio />} label="Asset" />
                                    <FormControlLabel value="assembly" control={<Radio />} label="Assembly" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container justify="space-evenly">
                        <Grid item xs={5}>
                            Date Created
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-evenly">
                                    <KeyboardDatePicker

                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        name="dateCreated"
                                        value={state.dateCreated}
                                        onChange={date => handleDateChange("dateCreated", date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <div></div>
                        <Grid item xs={5}>
                            Date Updated
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-evenly">
                                    <KeyboardDatePicker
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        name="dateUpdated"
                                        value={state.dateUpdated}
                                        onChange={date => handleDateChange("dateUpdated", date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}

                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>

                    </Grid>
                    <Grid container justify="space-around">
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="groupTag"
                                label="Group Tag"
                                type="text"
                                fullWidth
                                value={state.groupTag}
                                onChange={handleChange}
                            />

                        </Grid>
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
}
