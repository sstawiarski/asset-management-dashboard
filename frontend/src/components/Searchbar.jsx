/*
 * Author: Shawn Stawiarski
 * October 2020
 * License: MIT
 */
import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce'

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl'
import { Fade, InputAdornment, InputLabel, OutlinedInput, Paper, Typography, Popper } from '@material-ui/core';
import Search from '@material-ui/icons/Search'

import SearchResult from './SearchResult'

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

    /* Delay API call on user input by 400ms */
    const debounceSearch = useCallback(debounce(eventTarget =>
        setState({
            ...state,
            searchTerm: eventTarget.value,
            anchor: eventTarget
        })
    , 400), [])

    const classes = useStyles();

    const [state, setState] = useState({
        searchTerm: '',
        result: [],
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

        if (state.searchTerm) {
            searchAssets(state.searchTerm)
                .then(result => {
                    setState(s => ({
                        ...s,
                        resultsOpen: true,
                        result: result
                    }))
                })

        } else {
            setState(s => ({
                ...s,
                resultsOpen: false,
                result: []
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
                            <Typography className={classes.viewAllButton} variant="button">View All</Typography>
                            <br />
                            {
                                state.result.length ?
                                state.result.map(item => (<SearchResult data={item} />))
                                : <Typography variant="body1" align="center">No results found</Typography>
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