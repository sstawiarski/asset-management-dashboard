import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl'
import { Fade, InputAdornment, InputLabel, OutlinedInput, Paper, Typography, Popper } from '@material-ui/core';
import Search from '@material-ui/icons/Search'

import SearchResult from './SearchResult'

const sampleItems = [{
    serial: "ELP-8089",
    description: "Electronic Pulser",
    events: [
        {
            date: "September 29th, 2020",
            eventType: "Ownership Change"
        },
        {
            date: "September 20th, 2020",
            eventType: "Reassignment"
        }
    ]
}]

const useStyles = makeStyles((theme) => ({
    searchbar: {
        width: '75%',
        marginTop: "10px"
    },
    popper: {
        width: '75%',
        marginLeft: '-5ch',
    },
    paper: {
        backgroundColor: "#FBFBFB",
        padding: "15px"
    },
    viewAllButton: {
        float: 'right',
        color: "#15ADFF",
        display: 'inline-block'
    }
}));

const Searchbar = () => {

    const classes = useStyles();

    const [state, setState] = useState({
        searchTerm: '',
        result: null,
        resultsOpen: false,
        anchor: null,
        eventsOpen: false,
        hasParent: false,
        inShipment: false
    })

    useEffect(() => {
        if (state.searchTerm) {
            setState({
                ...state,
                resultsOpen: true,
                result: sampleItems[0]
            })
        } else {
            setState({
                ...state,
                resultsOpen: false,
                result: null
            })
        }
    }, [state.searchTerm])

    const handleChange = (event) => {
        setState({
            ...state,
            searchTerm: event.target.value,
            anchor: event.target
        });
    }

    return (
        <div>
            <Popper className={classes.popper} open={state.resultsOpen} anchorEl={state.anchor} placement='bottom' transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={250}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" style={{ display: 'inline-block' }}>Search results</Typography>
                            <Typography className={classes.viewAllButton} variant="button">View All</Typography>
                            <br />
                            {
                                state.result ?
                                sampleItems.map(item => (<SearchResult data={item} />))
                                :
                                <Typography className={classes.viewAllButton} variant="button">No results found</Typography>
                            }
                        </Paper>
                    </Fade>
                )}
            </Popper>
            <FormControl className={classes.searchbar} variant="outlined">
                <InputLabel htmlFor="searchbar">Enter an asset serial</InputLabel>
                <OutlinedInput
                    id="searchbar"
                    type="text"
                    value={state.searchTerm}
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start"><Search /></InputAdornment>
                    }
                    labelWidth={150} />
            </FormControl>
        </div>
    );
}

export default Searchbar;