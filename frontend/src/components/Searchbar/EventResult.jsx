/*
 * Author: Shawn Stawiarski
 * October 2020
 * License: MIT
 */
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles'

import { Link } from 'react-router-dom';
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Portal from '@material-ui/core/Portal';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import EventDetailsViewer from '../EventDetailsViewer';

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

const EventResult = ({ data, closePopper }) => {
    const classes = useStyles();

    const [showProducts, toggleProducts] = useState(false);
    const [showDetails, toggleShowDetails] = useState(false);

    const container = React.useRef(null); //location of events dropdown to open

    return (
        <>
        <div className={classes.root}>
            <div className={classes.searchItem}>
                <div style={{ marginLeft: '5px' }} onClick={() => toggleShowDetails(true)}>
                        <Typography variant="body1"><b>{data.key}</b></Typography>
                        <Typography variant="body2">{data.eventType}</Typography>
                        <Typography variant="body2">{new Date(data.eventTime).toLocaleDateString('en-US', dateOptions)}</Typography>
                </div>
            </div>
            <div style={{ marginLeft: '5px' }}>

                {
                    data.productIds.length ?
                        <Grid container direction="row">
                            <Grid item>
                                <Typography variant="subtitle2">Associated products</Typography>
                            </Grid>
                            <Grid item>
                                {
                                    showProducts ?
                                        <KeyboardArrowDown className={classes.button} onClick={() => toggleProducts(!showProducts)} />
                                        : <KeyboardArrowRight className={classes.button} onClick={() => toggleProducts(!showProducts)} />
                                }
                            </Grid>
                        </Grid>
                        : null
                }

                {
                    showProducts && data.productIds.length ?
                        <Portal container={container.current}>
                            <div className={classes.events}>

                                {data.productIds.map(product => {
                                    return (
                                        <Typography variant="body2" className={classes.searchItem} key={product}>
                                            <Link to={`/assets/${product}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                <b>{product}</b>
                                            </Link>
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
        <EventDetailsViewer event={data} open={showDetails} onClose={() => toggleShowDetails(false)} />
        </>
    );
};

export default EventResult;