import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper, Grid, Divider, Button, Box, Dialog, DialogTitle, Select, FormControl, InputLabel, MenuItem, DialogActions, DialogContent, TextField, Table, Checkbox } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

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
        marginLeft: "10px"
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
}))

const CreateAssembly = () => {
    const classes = useStyles();

    const [assemblyStarted, toggleAssembly] = useState(false);
    const [creatorOpen, setCreatorOpen] = useState(false);
    const [state, setState] = useState({
        assemblyType: "",
        groupTag: "",
        owner: "",
        selected: []
    })

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const getComparator = (order, orderBy) => order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

    const headCells = [
        { id: 'serial', numeric: false, disablePadding: false, label: 'Serial' },
        { id: 'product', numeric: false, disablePadding: false, label: 'Product' },
        { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
        { id: 'owner', numeric: false, disablePadding: false, label: 'Owner' },
        { id: 'group-tag', numeric: false, disablePadding: false, label: 'Group Tag' },
    ];

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

    return (
        <div>
            <Header heading="Products" subheading="Assembly Creator" />
            <div className="picker-window">
                <Grid container spacing={2}>
                    <Grid container>
                        <Grid item xs={12} sm={8} lg={9}>
                            <Box display="flex" flexDirection="column" alignItems="flex-start">
                                <Typography variant="h6" className={classes.title}>Product Selection</Typography>
                                {assemblyStarted ? <Button style={{ marginLeft: "15px" }}>Filter</Button> : null}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                            <Box display="flex" justifyContent="flex-start">
                                <Typography variant="h6" className={classes.title}>Assembly Cart</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={8} lg={9}>
                        <Paper className={classes.paper} elevation={3}>
                            {
                                assemblyStarted
                                    ? <ReusableTable headCells={headCells} rows={rows} rowsPerPage={15} addHandler={handleAddToCart} />
                                    : <Box m="auto">
                                        <Typography variant="body1" className={classes.item}>No Assembly In Progress</Typography>
                                        <div style={{ flexBasis: "100%", height: 0 }} />
                                        <Button className={classes.button} onClick={handleStart}>Create New Assembly</Button>
                                    </Box>
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4} lg={3}>

                        <Paper className={`${classes.paper} ${assemblyStarted ? "" : classes.cartInactive}`} elevation={3}>
                            {assemblyStarted ? <CartTable header={headCells} rows={state.selected} /> : null}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
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