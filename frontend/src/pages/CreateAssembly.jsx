import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper, Grid, Divider, Button, Box, Dialog, DialogTitle, Select, FormControl, InputLabel, MenuItem, DialogActions, DialogContent, TextField } from '@material-ui/core';

import Header from '../components/Header'

const useStyles = makeStyles((theme) => ({
    paper: {
        width: "95%",
        marginLeft: "10px",
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
        owner: ""
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

    return (
        <div>
            <Header heading="Products" subheading="Assembly Creator" />
            <div className="picker-window">
                <Grid container>
                    <Grid item xs={8}>
                        <Box display="flex" justifyContent="flex-start">
                            <Typography variant="h6" className={classes.title}>Product Selection</Typography>
                        </Box>
                        <Paper className={classes.paper} elevation={3}>
                            <Box
                                m="auto"
                            >
                                <Typography variant="body1" className={classes.item}>No Assembly In Progress</Typography>
                                <div style={{ flexBasis: "100%", height: 0 }} />
                                <Button className={classes.button} onClick={handleStart}>Create New Assembly</Button>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Box display="flex" justifyContent="flex-start">
                            <Typography variant="h6" className={classes.title}>Assembly Cart</Typography>
                        </Box>
                        <Paper className={`${classes.paper} ${classes.cartInactive}`} elevation={3}>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
            <Dialog onClose={handleCancel} onSubmit={handleCreate} open={creatorOpen}>
                <DialogTitle>Create new assembly</DialogTitle>
                <DialogContent>
                    <form className={classes.form}>
                        <FormControl className={classes.formControl}>
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
                        <FormControl className={classes.formControl}>
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
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateAssembly;