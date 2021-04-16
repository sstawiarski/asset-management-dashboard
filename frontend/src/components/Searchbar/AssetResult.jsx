/*
 * Author: Shawn Stawiarski
 * October 2020
 * License: MIT
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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
    },
    viewMoreEvents: {
        color: "#15ADFF",
        textDecoration: 'none'
    }
}))

const AssetResult = ({ data, divider }) => {
    const classes = useStyles();

    const [showEvents, toggleEvents] = useState(false);
    const [events, setEvents] = useState([]);
    const [parent, setParent] = useState(null);
    const [viewMoreEvents, toggleViewMoreEvents] = useState(false);

    const container = React.useRef(null); //location of events dropdown to open
    const eventLimit = 3;

    /* Fetch events for the given data */
    useEffect(() => {
        const fetchEvents = async (id) => {
            const result = await fetch(`${process.env.REACT_APP_API_URL}/events/${id}?limit=3`);
            const json = await result.json();
            return json;
        };

        fetchEvents(data.serial)
            .then(result => {
                
                /* Only show 3 events at a time in the dropdown */
                if (result.length >= eventLimit) {
                    const shorterEvents = result.slice(0, eventLimit);
                    setEvents(shorterEvents);
                    toggleViewMoreEvents(true);
                } else {
                    setEvents(result);
                }
            });

    }, [data])

    /* Fetch information about parent assembly if applicable */
    useEffect(() => {
        const fetchParentInfo = async (id) => {
            const result = await fetch(`${process.env.REACT_APP_API_URL}/assets/${id}`);
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
                                {
                                    showEvents ?
                                        <KeyboardArrowDown className={classes.button} onClick={() => toggleEvents(!showEvents)} />
                                        : <KeyboardArrowRight className={classes.button} onClick={() => toggleEvents(!showEvents)} />
                                }
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

                                {
                                    viewMoreEvents ?
                                    <Link to={`/assets/${data.serial}`} className={classes.viewMoreEvents}>View more events</Link>
                                    : null
                                }

                            </div>
                        </Portal>
                        : null
                }

                <div ref={container} className={classes.eventItem} />
                {divider ? <Divider /> : null}
            </div>
        </div>
    );
};

AssetResult.propTypes = {
    data: PropTypes.object,
    divider: PropTypes.element
}

export default AssetResult;