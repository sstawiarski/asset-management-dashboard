/*
 * Author: Shawn Stawiarski
 * October 2020
 * License: MIT
 */
import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles'

import { Link } from 'react-router-dom';
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Portal from '@material-ui/core/Portal';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
}

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: "10px",
    },
    events: {
        paddingLeft: "5ch"
    },
    button: {
        cursor: "pointer"
    },
    searchItem: {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: '#E8E8E8',
            borderRadius: "5px"
        }
    },
    eventItem: {
        paddingBottom: "6px"
    }
}))

const SearchResult = ({ data }) => {
    const classes = useStyles();

    const [showEvents, toggleEvents] = useState(false);
    const [events, setEvents] = useState([]);
    const [parent, setParent] = useState(null);

    const container = React.useRef(null); //location of events dropdown to open

    {/* Fetch events for the given data */}
    useEffect(() => {
        const fetchEvents = async (id) => {
            const result = await fetch(`http://localhost:4000/events/${id}`);
            const json = await result.json();
            return json;
        };

        fetchEvents(data.serial)
            .then(result => {
                setEvents(result);
            });

    }, [data])

    {/* Fetch information about parent assembly if applicable */}
    useEffect(() => {
        const fetchParentInfo = async (id) => {
            const result = await fetch(`http://localhost:4000/assets/${id}`);
            const json = await result.json();
            return json;
        };

        if (data.parentId) {
            fetchParentInfo(data.parentId)
                .then(result => {
                    setParent(result);
                })
        }
    }, [data.parentId])

    return (
        <div className={classes.root}>
            <div className={classes.searchItem}>
                <div style={{ marginLeft: '5px' }}>
                    <Link to={`/assets/${data.serial}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="body1"><b>{data.serial}</b></Typography>
                        <Typography variant="body2">{data.assetName}</Typography>
                        <Typography variant="body2">{data.assetType}</Typography>
                    </Link>
                </div>
            </div>
            <div style={{ marginLeft: '5px' }}>

                {
                    parent ?
                        <Link to={`/assets/${parent.serial}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <Typography variant="body2"><b>Parent Assembly: </b>{parent.assetName} ({parent.serial})</Typography>
                        </Link>
                        : null
                }

                {
                    events.length ?
                        <Grid container direction="row">
                            <Grid item>
                                <Typography variant="subtitle2">Events</Typography>
                            </Grid>
                            <Grid item>
                                {showEvents ? <KeyboardArrowDown className={classes.button} onClick={() => toggleEvents(!showEvents)} /> : <KeyboardArrowRight className={classes.button} onClick={() => toggleEvents(!showEvents)} />}
                            </Grid>
                        </Grid>
                        : null
                }

                {
                    showEvents && events.length ?
                        <Portal container={container.current}>
                            <div className={classes.events}>

                                {events.map(event => {
                                    return (
                                        <Typography variant="body2" className={classes.eventItem} key={event.key}>
                                            <b>{new Date(event.eventTime).toLocaleDateString('en-US', dateOptions)}</b>
                                            <br />
                                            {event.key}
                                            <br />
                                            {event.eventType}
                                        </Typography>
                                    )
                                })}

                            </div>
                        </Portal>
                        : null
                }

                <div ref={container} className={classes.eventItem} />
                <Divider />
            </div>
        </div>
    );
};

export default SearchResult;