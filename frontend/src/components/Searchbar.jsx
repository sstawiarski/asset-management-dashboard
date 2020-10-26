/*
 * Author: Shawn Stawiarski
 * October 2020
 * License: MIT
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce'

import { makeStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl'
import { Fade, InputAdornment, InputLabel, OutlinedInput, Paper, Typography, Popper } from '@material-ui/core';
import Search from '@material-ui/icons/Search'

import AssetResult from './AssetResult'
import EventResult from './EventResult'

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
    },
}));

const Searchbar = () => {

    /* Delay API call on user input by 500ms */
    const debounceSearch = useCallback(debounce(eventTarget =>
        setState({
            ...state,
            searchTerm: eventTarget.value,
            anchor: eventTarget
        })
        , 500), [])

    const classes = useStyles();

    const [state, setState] = useState({
        searchTerm: '',
        assetResult: [],
        eventResult: [],
        resultsOpen: false,
        anchor: null,
        eventsOpen: false,
    })

    /* Fuzzy search assets using API call */
    useEffect(() => {
        const searchAssets = async (serial) => {
            const result = await fetch(`http://localhost:4000/assets?search=${serial}`);
            const json = await result.json();
            return json;
        };

        const searchEvents = async (key) => {
            const result = await fetch(`http://localhost:4000/events?search=${key}`);
            const json = await result.json();
            return json;
        };

        if (state.searchTerm) {
            searchAssets(state.searchTerm)
                .then(result => {
                    setState(s => ({
                        ...s,
                        resultsOpen: true,
                        assetResult: result
                    }))
                });

            searchEvents(state.searchTerm)
                .then(result => {
                    setState(s => ({
                        ...s,
                        resultsOpen: true,
                        eventResult: result
                    }))
                });

        } else {
            setState(s => ({
                ...s,
                resultsOpen: false,
                assetResult: [],
                eventResult: []
            }))
        }

    }, [state.searchTerm])

    const handleChange = (event) => {
        debounceSearch(event.target)
    }

    return (
        <div>
            <Popper className={classes.popper} open={state.resultsOpen} anchorEl={state.anchor} placement='bottom' transition>

                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={250}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" style={{ display: 'inline-block' }}>Search results</Typography>
                            <Link to={`/search/${state.searchTerm}`}>
                                <Typography className={classes.viewAllButton} variant="button">View All</Typography>
                            </Link>
                            <Typography variant="body1" align="left"><b>Products</b></Typography>
                            <br />
                            {
                                state.assetResult.length ?
                                    state.assetResult.map(item => (<AssetResult data={item} key={item.serial} />))
                                    : <Typography variant="body1" align="center">No products found</Typography>
                            }
                            <hr />
                            <Typography variant="body1" align="left"><b>Events</b></Typography>
                            <br />
                            {
                                state.eventResult.length ?
                                    state.eventResult.map(item => (<EventResult data={item} key={item.key} />))
                                    : <Typography variant="body1" align="center">No events found</Typography>
                            }
                        </Paper>
                    </Fade>
                )}

            </Popper>

            <FormControl className={classes.searchbar} variant="outlined">
                <InputLabel htmlFor="searchbar">Enter a product serial or event key</InputLabel>
                <OutlinedInput
                    id="searchbar"
                    type="text"
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start"><Search /></InputAdornment>
                    }
                    labelWidth={250} />
            </FormControl>
        </div>
    );
}

export default Searchbar;