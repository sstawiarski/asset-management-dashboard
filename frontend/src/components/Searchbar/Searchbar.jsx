import React, { useEffect, useState, useRef } from 'react';

//Library Tools
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce'
import { makeStyles } from '@material-ui/core/styles';

//Material-UI Components
import FormControl from '@material-ui/core/FormControl'
import Fade from '@material-ui/core/Fade';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Divider from '@material-ui/core/Divider';

//Custom Components
import AssetResult from './AssetResult'
import EventResult from './EventResult'

//Icons
import Search from '@material-ui/icons/Search'

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
    divider: {
        marginTop: "5px",
        marginBottom: "10px"
    }
}));

const Searchbar = () => {

    /* Delay API call on user input by 500ms */
    const debounceSearch = useRef(debounce(eventTarget =>
        setState({
            ...state,
            searchTerm: eventTarget.value,
            anchor: eventTarget
        }), 500)
    );

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
            const result = await fetch(`${process.env.REACT_APP_API_URL}/assets?search=${serial}&limit=3`);
            if (result.status < 300) {
                const json = await result.json();
                return json.data;
            }
            else {
                return [];
            }

        };

        const searchEvents = async (key) => {
            const result = await fetch(`${process.env.REACT_APP_API_URL}/events?search=${key}&limit=3`);
            if (result.status < 300) {
                const json = await result.json();
                return json.data;
            } else {
                return [];
            }
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
        debounceSearch.current(event.target)
    }

    return (
        <div>
            <Popper className={classes.popper} open={state.resultsOpen} anchorEl={state.anchor} placement='bottom' transition>

                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={250}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" style={{ display: 'inline-block' }}>Search results</Typography>
                            <Link to={`/search/${state.searchTerm}`}>
                                <Typography className={classes.viewAllButton} variant="button" id="details-button">View All</Typography>
                            </Link>
                            <Typography variant="body1" align="left"><b>Products</b></Typography>
                            {
                                state.assetResult.length ?
                                    state.assetResult.map((item, idx) => (<AssetResult data={item} key={item.serial} divider={idx === (state.assetResult.length - 1) ? false : true} />))
                                    : <Typography variant="body1" align="center">No products found</Typography>
                            }
                            <Divider className={classes.divider} />
                            <Typography variant="body1" align="left"><b>Events</b></Typography>
                            {
                                state.eventResult.length ?
                                    state.eventResult.map(item => (<EventResult data={item} key={item.key} />))
                                    : <Typography variant="body1" align="center">No events found</Typography>
                            }
                        </Paper>
                    </Fade>
                )}

            </Popper>

            <FormControl className={classes.searchbar} variant="outlined" style={{ backgroundColor: "white" }}>
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