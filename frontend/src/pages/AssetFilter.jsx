import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper, Grid, Divider, RadioGroup, TextField } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Header from '../components/Header'


const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 400,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
}));



export default function FormDialog() {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    return (

        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Filter Assets
            </Button>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <div>
                    <Grid container>
                        <Grid item xs={12}>
                            <Header heading="Filter Assets" />
                        </Grid>

                    </Grid>
                    <Grid container>
                        <Grid item xs={4}>
                            Status
                        <RadioGroup
                                name="Status"
                                column>
                                {["Show All", "Active", "Retired"].map((value) => (
                                    <FormControlLabel
                                        key={value}
                                        value={value.toString()}
                                        control={<Radio />}
                                        label={value.toString()}
                                    />
                                ))}
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={4}>
                            Assignment
                        <RadioGroup
                                name="Assignment"
                                column>
                                {["Show All", "Owned", "Rented"].map((value) => (
                                    <FormControlLabel
                                        key={value}
                                        value={value.toString()}
                                        control={<Radio />}
                                        label={value.toString()}
                                    />
                                ))}
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={4}>
                            Product Types
                        <RadioGroup
                                name="Status"
                                column>
                                {["Show All", "Asset", "Assembly"].map((value) => (
                                    <FormControlLabel
                                        key={value}
                                        value={value.toString()}
                                        control={<Radio />}
                                        label={value.toString()}
                                    />
                                ))}
                            </RadioGroup>
                        </Grid>

                    </Grid>
                    <Grid container>
                        <Grid item xs={6}>
                            Date Created
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Date picker inline"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={6}>
                            Date Updated
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Date picker inline"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>

                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="groupTag"
                                label="Group Tag"
                                type="text"
                                fullWidth
                            />

                        </Grid>
                    </Grid>
                </div>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Reset
          </Button>
                    <Button onClick={handleClose} color="primary">
                        Filter
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}


