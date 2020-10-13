import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles'

import { Link } from 'react-router-dom';
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Portal from '@material-ui/core/Portal';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: "10px"
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

    const container = React.useRef(null);

    return (
        <div className={classes.root}>
            <div className={classes.searchItem}>
                <Link to={`/assets/${data.serial}`} style={{textDecoration: "none", color: "inherit"}}>
                    <Typography variant="body1">{data.serial}</Typography>
                    <Typography variant="body1">{data.description}</Typography>
                </Link>
            </div>
            <div>
                <Grid container direction="row">
                    <Grid item>
                        <Typography variant="subtitle2">Events</Typography>
                    </Grid>
                    <Grid item>
                        {showEvents ? <KeyboardArrowDown className={classes.button} onClick={() => toggleEvents(!showEvents)} /> : <KeyboardArrowRight className={classes.button} onClick={() => toggleEvents(!showEvents)} />}
                    </Grid>
                </Grid>
                {showEvents ?
                    (<Portal container={container.current}>
                        <div className={classes.events}>
                            {data.events.map(event => {
                                return (<Typography variant="body2" className={classes.eventItem} key={event.date}><b>{event.date}</b> <br /> {event.eventType}</Typography>)
                            })}
                        </div>
                    </Portal>) : null}
                <div ref={container} />
                <Divider />
            </div>

        </div>
    );
};

export default SearchResult;