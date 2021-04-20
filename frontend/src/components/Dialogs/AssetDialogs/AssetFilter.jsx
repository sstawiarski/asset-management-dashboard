import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import DateFnsUtils from '@date-io/date-fns';

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default function FormDialog({ open, setOpen, setActiveFilters, assetList }) {

    const [state, setState] = useState({
        retired: "all",
        dateCreated: null,
        lastUpdated: null,
        assignmentType: "all",
        assetType: "all",
        groupTag: "",
        checkedOut: "all",
        assembled: "all",
        assetTypes: null,
    });

    /* Fetch names for all asset/assembly types in the database */
    useEffect(() => {
        let url = assetList ? `${process.env.REACT_APP_API_URL}/assets/assembly/schema?type=${assetList}` : `${process.env.REACT_APP_API_URL}/assets/assembly/schema?all=true`;
        fetch(url)
            .then(res => res.json())
            .then(json => {
                let types = null;
                if (assetList) {
                    types = json["components"].map(item => ({ name: item, checked: true }));
                } else {
                    types = json.map(item => ({ name: item.name, checked: true }));
                }
                setState(s => ({ ...s, assetTypes: types }));
            });
    }, [assetList])

    const handleClose = () => {
        setOpen(false);
    };

    /* Convert the input values to proper stringified JSON and then send them to the parent */
    const handleSubmit = () => {
        const disallowed = ["all", null, ""];
        const onlyActive = Object.keys(state)
            .reduce((p, c) => {
                if (!disallowed.includes(state[c])) {
                    if (c === "assetTypes") {
                        if (state[c]) {
                            const excluding = state[c].reduce((res, type) => {
                                if (!type.checked) {
                                    res.push(type.name)
                                }
                                return res;
                            }, []);
                            p["exclude"] = encodeURI(JSON.stringify(excluding));
                        }
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

    const handleChange = (event) => {
        const { name, value } = event.target
        if (value === "assetTypes") {
            const found = state.assetTypes.findIndex(item => item.name === name);
            const foundType = state.assetTypes[found];
            const newVal = !foundType.checked;
            let newAssets = state.assetTypes;
            newAssets[found] = { name: name, checked: newVal };
            setState(s => ({
                ...s,
                assetTypes: newAssets
            }));
        } else {
            setState(s => ({
                ...s,
                [name]: value
            }));
        }
    };

    /* Asset type checkbox handler */
    const handleBoxes = (boolean) => {
        const newSelections = state.assetTypes.map(item => ({ ...item, checked: boolean }));
        setState(s => ({ ...s, assetTypes: newSelections }));
    }

    const handleReset = () => {
        setState(s => ({
            ...s,
            retired: "all",
            dateCreated: null,
            lastUpdated: null,
            assetType: "all",
            assignmentType: "all",
            groupTag: "",
            checkedOut: "all",
            assembled: "all"
        }));
        handleBoxes(true);
    }

    const handleDateChange = (name, newDate) => {
        setState(s => ({
            ...s,
            [name]: newDate
        }))
    }

    return (
        <Dialog open={open || false} onClose={handleClose} aria-labelledby="form-dialog-title">
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

                    {/* Display filter for assembled vs. disassembled assembly only when asset type is specified as assembly */}
                    {
                        state.assetType === "Assembly" ?
                            <>
                                <Grid item xs={3} />
                                <Grid item xs={3} />
                                <Grid item xs={3} style={{ paddingTop: "10px" }}>
                                    <FormControl component="fieldset">
                                        <span>Assembly State</span>
                                        <RadioGroup aria-label="types" name="assembled" value={state.assembled} onChange={handleChange}>
                                            <FormControlLabel value="all" control={<Radio />} label="Show All" />
                                            <FormControlLabel value="Yes" control={<Radio />} label="Assembled" />
                                            <FormControlLabel value="No" control={<Radio />} label="Disassembled" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3} />
                            </>
                            : null
                    }

                    {
                        state.assetTypes ?
                            <Grid item xs={12} style={{ paddingTop: "10px" }}>

                                <span>Asset Types</span>
                                <br />
                                <div style={{ textAlign: "center" }}>
                                    <FormControl component="fieldset">

                                        <FormGroup name="assetTypes" aria-label="types">
                                            {/* Split names of asset names into two rows and display */}
                                            {
                                                state.assetTypes.slice(0, Math.floor(state.assetTypes.length / 2)).map((type, idx) => {
                                                    return (
                                                        <FormControlLabel
                                                            key={idx}
                                                            control={
                                                                <Checkbox
                                                                    checked={type.checked}
                                                                    name={type.name}
                                                                    value="assetTypes"
                                                                    onChange={handleChange}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={type.name} />
                                                    )
                                                })
                                            }
                                        </FormGroup>
                                    </FormControl>
                                    <FormControl component="fieldset">
                                        <FormGroup name="assetTypes" aria-label="types">
                                            {
                                                state.assetTypes.slice(Math.floor(state.assetTypes.length / 2)).map((type, idx) => {
                                                    return (
                                                        <FormControlLabel
                                                            key={idx}
                                                            control={
                                                                <Checkbox
                                                                    checked={type.checked}
                                                                    name={type.name}
                                                                    value="assetTypes"
                                                                    onChange={handleChange}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={type.name} />)
                                                })
                                            }
                                        </FormGroup>
                                    </FormControl>
                                    <br />
                                    <Button variant="text" color="secondary" onClick={() => handleBoxes(true)}>Select All</Button>
                                    <Button variant="text" color="secondary" onClick={() => handleBoxes(false)}>Clear</Button>
                                </div>
                            </Grid>
                            : null
                    }

                </Grid>

                <Grid container justify="space-evenly" style={{ marginTop: "20px" }}>
                    <Grid item xs={5}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-evenly">
                                <KeyboardDatePicker

                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="created-date-picker"
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
                                    id="updated-date-picker"
                                    name="lastUpdated"
                                    label="Last Updated"
                                    value={state.lastUpdated}
                                    inputVariant="outlined"
                                    onChange={date => handleDateChange("lastUpdated", date)}
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

FormDialog.propTypes = {
    open: PropTypes.bool, 
    setOpen: PropTypes.func, 
    setActiveFilters: PropTypes.func,
    assetList: PropTypes.array
}