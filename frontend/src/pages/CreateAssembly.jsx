/*
 * Author: Shawn Stawiarski
 * October 2020
 * License: MIT
 */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import ReusableTable from '../components/ReusableTable'
import CartTable from '../components/CartTable';
import Header from '../components/Header'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginLeft: "15px",
        marginRight: "15px",
        height: "75vh",
        display: "flex"
    },
    item: {
        padding: theme.spacing(2)
    },
    break: {
        flexGrow: 1,
        fontWeight: "bold"
    },
    button: {
        color: "#3CB3E6"
    },
    title: {
        marginLeft: "20px",
    },
    cartInactive: {
        backgroundColor: "#D9D9D9",
    },
    settingTitle: {
        padding: "0px 24px 16px 24px",
        color: "#000000",
        opacity: "0.58",
        fontWeight: "bold"
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: 180,
        maxWidth: 250
    },
    spacer: {
        padding: "6px 8px"
    }
}))

//table headings and sample data
const headCells = [
    { id: 'serial', numeric: false, disablePadding: false, label: 'Serial' },
    { id: 'product', numeric: false, disablePadding: false, label: 'Product' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'owner', numeric: false, disablePadding: false, label: 'Owner' },
    { id: 'group-tag', numeric: false, disablePadding: false, label: 'Group Tag' },
];

//TODO: Replace in functional component with fetches to API
const rows = [
    {
        "serial": "ELP-8000",
        "product": "Asset",
        "description": "Electronics Probe",
        "owner": "Supply Chain USA",
        "groupTag": "Heyyy"
    },
    {
        "serial": "CLP-8000",
        "product": "Asset",
        "description": "Electronics Thingie",
        "owner": "Supply Chain USA",
        "groupTag": "Heyyy"
    }
]

const CreateAssembly = () => {
    const classes = useStyles();

    const [assemblyStarted, toggleAssembly] = useState(false);
    const [creatorOpen, setCreatorOpen] = useState(false);

    const [state, setState] = useState({
        assemblyType: "",
        groupTag: "",
        owner: "",
        selected: [],
        selectedTableRows: []
    })

    const handleStart = () => {
        setCreatorOpen(true);
    }

    const handleCreate = (event) => {
        event.preventDefault();
        setCreatorOpen(false);
        toggleAssembly(true);
    }

    const handleCancel = () => {
        setCreatorOpen(false);
        toggleAssembly(false);
        setState(s => {
            Object.keys(s).forEach(key => s[key] = "")
            return (s);
        })
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setState(s => ({
            ...s,
            [name]: value
        }))
    }

    const handleAddToCart = (items) => {
        setState(s => ({
            ...s,
            selected: items
        }))
    }

    const handleRemoveFromCart = (serial) => {
        setState(s => ({
            ...s,
            selected: s.selected.filter(item => item !== serial),
            selectedTableRows: s.selectedTableRows.filter(item => item !== serial)
        }))
    }

    const setSelectedTableRows = (newRows) => {
        setState(s => ({
            ...s,
            selectedTableRows: newRows
        }))
    }

    return (
        <div>
            <Header heading="Products" subheading="Assembly Creator" />
            <div className="picker-window">
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={8} lg={9}>
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Typography variant="h6" className={classes.title}>Product Selection</Typography>
                            <Button style={{ marginLeft: "15px", visibility: assemblyStarted ? "visible" : "hidden" }}>Filter</Button>
                        </Box>

                        {
                            assemblyStarted
                                ? <ReusableTable
                                    headCells={headCells}
                                    rows={rows}
                                    rowsPerPage={15}
                                    addHandler={handleAddToCart}
                                    selected={state.selectedTableRows}
                                    setSelected={setSelectedTableRows} />
                                : <Paper className={classes.paper}>
                                    <Box m="auto">
                                        <Typography variant="body1" className={classes.item}>No Assembly In Progress</Typography>
                                        <div style={{ flexBasis: "100%", height: 0 }} />
                                        <Button className={classes.button} onClick={handleStart}>Create New Assembly</Button>
                                    </Box>
                                </Paper>
                        }
                    </Grid>

                    <Grid item xs={12} sm={4} lg={3}>

                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Typography variant="h6" className={classes.title}>Assembly Cart</Typography>
                            <Button style={{ marginLeft: "15px", visibility: "hidden" }}>Collapse Cart</Button>
                        </Box>

                        {assemblyStarted ? <CartTable header={headCells} rows={state.selected} handleRemove={handleRemoveFromCart} /> : <Paper className={`${classes.paper} ${assemblyStarted ? "" : classes.cartInactive}`} elevation={3} />}


                    </Grid>
                </Grid>
            </div>

            {/* Dialog code, included in same file for access to state */}
            {/* TODO: Replace dropdown options with actual options */}
            <Dialog onClose={handleCancel} onSubmit={handleCreate} open={creatorOpen}>
                <DialogTitle>Create new assembly</DialogTitle>

                <DialogContent style={{ paddingLeft: "64px", paddingRight: "64px", overflow: "hidden" }}>
                    <form className={classes.form}>
                        <FormControl required className={classes.formControl}>
                            <InputLabel id="type-label" variant="outlined">Assembly Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                variant="outlined"
                                name="assemblyType"
                                value={state.assemblyType}
                                labelWidth={110}
                                onChange={handleChange}>
                                <MenuItem value="Carrier">Carrier</MenuItem>
                                <MenuItem value="Gap Sub">Gap Sub</MenuItem>
                            </Select>
                        </FormControl>
                        <div className={classes.formControl}>
                            <TextField
                                label="Group Tag"
                                id="tag"
                                variant="outlined"
                                name="groupTag"
                                value={state.groupTag}
                                onChange={handleChange}>
                            </TextField>
                        </div>
                        <FormControl required className={classes.formControl}>
                            <InputLabel id="owner-label" variant="outlined">Owner</InputLabel>
                            <Select
                                labelId="owner-label"
                                id="owner"
                                variant="outlined"
                                name="owner"
                                value={state.owner}
                                labelWidth={48}
                                onChange={handleChange}>
                                <MenuItem value="Carrier">Evolution-USA</MenuItem>
                                <MenuItem value="Gap Sub">Supply Chain USA</MenuItem>
                            </Select>
                        </FormControl>

                        <div style={{ textAlign: 'right', padding: 8, margin: '12px -12px -6px -12px' }}>
                            <Button className={classes.button} onClick={handleCancel}>Cancel</Button>
                            <Button className={classes.button} type="submit">Create</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateAssembly;