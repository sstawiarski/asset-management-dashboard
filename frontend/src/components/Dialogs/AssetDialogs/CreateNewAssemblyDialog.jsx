import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    button: {
        color: "#3CB3E6"
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
    }
}))

const CreateNewAssemblyDialog = ({ creatorOpen, handleCreate, handleCancel }) => {
    const classes = useStyles();
    const [state, setState] = useState({
        assemblyType: "",
        groupTag: "",
        owner: "",
        types: []
    })


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
            assemblyType: "",
            groupTag: "",
            owner: "",
            types: []
        })
    }

    useEffect(() => {
        if (creatorOpen) {
            fetch(`${process.env.REACT_APP_API_URL}/assets/assembly/schema?all=true&assembly=true`)
            .then(response => response.json())
            .then(json => setState(s => ({
                ...s,
                types: json
            })));
        }
    }, [creatorOpen])

    return (
        <Dialog onClose={handleCancel} onSubmit={handleSubmit} open={creatorOpen} >
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
                            {state.types.length > 0 ? state.types.map((menuItem, idx) => <MenuItem key={idx} value={menuItem.name}>{menuItem.name}</MenuItem>) : null}
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
                            <MenuItem value="Supply Chain-CAN">Supply Chain-CAN</MenuItem>
                            <MenuItem value="Supply Chain-USA">Supply Chain-USA</MenuItem>
                        </Select>
                    </FormControl>

                    <div style={{ textAlign: 'right', padding: 8, margin: '12px -12px -6px -12px' }}>
                        <Button className={classes.button} onClick={handleCancel}>Cancel</Button>
                        <Button className={classes.button} type="submit">Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

CreateNewAssemblyDialog.propTypes = {
    creatorOpen: PropTypes.bool, 
    handleCreate: PropTypes.func, 
    handleCancel: PropTypes.func
}

export default CreateNewAssemblyDialog;