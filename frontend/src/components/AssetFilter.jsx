import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles'
import { Grid, RadioGroup, TextField, FormControl } from '@material-ui/core';
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
        flexDirection: 'column',
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

    const classes = (useStyles);


    return (

        <div>

            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Filter Assets
            </Button>
            
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Grid container alignContent="space-around" alignItems="center">
                    <div>
                        <Grid container>
                            <Grid item xs={3}>
                                <Header heading="Filter Assets" />
                            </Grid>

                        </Grid>
                        <Grid container justify="space-around">
                            <Grid item xs={3}>
                                <FormControl component ="fieldset">
                                    <formLabel compoonent="legend">Status</formLabel>
                                    <RadioGroup aria-label="status" name="status1" >
                                        <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                        <FormControlLabel value="active" control={<Radio />} label="Active" />
                                        <FormControlLabel value="retired" control={<Radio />} label="Retired" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl component ="fieldset">
                                    <formLabel compoonent="legend">Assignment</formLabel>
                                    <RadioGroup aria-label="assignment" name="assignment1" >
                                        <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                        <FormControlLabel value="owned" control={<Radio />} label="Owned" />
                                        <FormControlLabel value="rented" control={<Radio />} label="Rented" />
                                    </RadioGroup>
                                </FormControl>
                            
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl component ="fieldset">
                                    <formLabel compoonent="legend">Assignment</formLabel>
                                    <RadioGroup aria-label="types" name="types1" >
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
                            <Grid item xs={5}>
                                Date Updated
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-evenly">
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
                        <Grid container xs={12}/>
                        <Grid container justify="flex-start">
                            <Grid item xs={1}/>
                            <Grid item xs={6}>
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
                </Grid>
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


