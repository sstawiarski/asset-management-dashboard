import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { DialogActions, InputLabel, TextField, Typography, FormControl } from '@material-ui/core';

const filter = createFilterOptions();

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
            fetch('http://localhost:4000/locations')
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
        handleCreate(state);
        setState({
            shipFrom: null,
            shipTo: null,
            shipmentType: "",
            newFromOption: null,
            newToOption: null
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
                                onChange={handleChange}>

                                <MenuItem value="Incoming">Incoming</MenuItem>
                                <MenuItem value="Outgoing">Outgoing</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} className={classes.autocomplete}>
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="shipment-from-locator"
                                    selectOnFocus
                                    clearOnBlur
                                    freeSolo
                                    className={classes.autocomplete}
                                    options={state.shipFromOptions}
                                    getOptionLabel={(option) => {
                                        if (option.inputValue) {
                                            return option.inputValue;
                                        } else {
                                            if (option.key) {
                                                return `${option.locationName} (${option.key})`;
                                            } else {
                                                return `${option.locationName}`;
                                            }
                                        }
                                    }}
                                    groupBy={(option) => option.locationType}
                                    value={state.shipFrom}
                                    onChange={(event, newValue) => {
                                        if (newValue && newValue.inputValue) {
                                            setState(s => ({ ...s, newFromOption: { locationName: newValue.inputValue, locationType: s.shipmentType === "Outgoing" ? "Staging Facility" : "" }, shipFrom: { locationName: newValue.inputValue } }))
                                        } else {
                                            setState(s => ({ ...s, shipFrom: newValue, newFromOption: null }));
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);
                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                inputValue: params.inputValue,
                                                locationName: `Add new location '${params.inputValue}'`,
                                                locationType: "Add New"
                                            })
                                        }

                                        return filtered;
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Ship From" variant="outlined" />}
                                    renderOption={(option) => {
                                        /* Render autocomplete list with subtitles that tell either the operator name, client name, or address */
                                        return (
                                            <div>
                                                {option.locationName} { option.key ? `(${option.key})` : null}
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
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {
                                    state.newFromOption ?
                                        <form className={classes.form}>
                                            <TextField
                                             fullWidth 
                                             className={classes.formItem}
                                             id="location-name" 
                                             value={state.newFromOption["locationName"]} 
                                             variant="outlined" 
                                             size="small"
                                             label="Location name" />

                                            <TextField 
                                            fullWidth 
                                            size="small"
                                            className={classes.formItem}
                                            id="location-key" 
                                            value={state.newFromOption["key"]} 
                                            variant="outlined" 
                                            label="Location key" />

                                            <Select className={classes.formItem} fullWidth id="location-type" value={state.newFromOption["locationType"]} variant="outlined" label="Location type" disabled={state.shipmentType === "Outgoing"}>
                                                {
                                                    state.shipmentType === "Outgoing" ?
                                                        <MenuItem value={"Staging Facility"}>Staging Facility</MenuItem>
                                                        :
                                                        <>
                                                            <MenuItem value={"Staging Facility"}>Staging Facility</MenuItem>
                                                            <MenuItem value={"Repair Facility"}>Repair Facility</MenuItem>
                                                            <MenuItem value={"Rig"}>Rig</MenuItem>
                                                        </>
                                                }
                                            </Select>

                                        </form>
                                        : null
                                }
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={6} className={classes.autocomplete}>
                        <Autocomplete
                            id="shipment-to-locator"
                            options={state.shipToOptions}
                            getOptionLabel={(option) => `${option.locationName} (${option.key})`}
                            value={state.shipTo}
                            fullWidth
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

export default CreateNewShipmentDialog;