import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Tooltip } from '@material-ui/core';

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric"
}

const useStyles = makeStyles(theme => ({
    content: {
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingBottom: "40px"
    },
    item: {
        marginBottom: "40px"
    },
    link: {
        textDecoration: "none",
        color: "inherit",
        padding: "5px",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#BDBDBD",
            borderRadius: "6px",
            transition: theme.transitions.create('background-color', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.standard,
            }),
        }
    },
    detailsLink: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline"
        }
    }
}))

const EventDetailsViewer = ({ event, open, onClose, onRedirect }) => {
    const classes = useStyles();
    const history = useHistory();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        try {
            if (event.initiatingUser) {
                fetch(`${process.env.REACT_APP_API_URL}/employees/${event.initiatingUser}`)
                    .then(res => res.json())
                    .then(json => setUsername(json));
            }
        } catch (err) {

        }
    }, [event])

    return (
        <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>Event Details</DialogTitle>
            <DialogContent className={classes.content}>
                {
                    event ?
                        <Grid container direction="row" justify="space-around" alignItems="center">
                            <Grid item xs={username ? 3 : 4} className={classes.item}>
                                <Typography variant="body1"><b>Event Key</b></Typography>
                                <Typography variant="body1">{event.key}</Typography>
                            </Grid>

                            <Grid item xs={username ? 3 : 4} className={classes.item}>
                                <Typography variant="body1"><b>Event Type</b></Typography>
                                <Typography variant="body1">{event.eventType}</Typography>
                            </Grid>

                            <Grid item xs={username ? 3 : 4} className={classes.item}>
                                <Typography variant="body1"><b>Event Time</b></Typography>
                                <Typography variant="body1">{new Date(event.eventTime).toLocaleString('en-US', dateOptions)}</Typography>
                            </Grid>

                            {
                                username ?
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="body1"><b>Initiated By</b></Typography>
                                        <Tooltip title={`ID: ${username.employeeId}`} placement="bottom-start">
                                            <Typography variant="body1">{username.name}</Typography>
                                        </Tooltip>
                                    </Grid>
                                    : null
                            }

                            <Grid item xs={12} className={classes.item}>
                                <Typography variant="body1"><b>Affected Products</b></Typography>
                                {
                                    event.productIds.map((prod, idx) =>
                                        <Typography key={idx} variant="body1">
                                            <span
                                                className={classes.link}
                                                onClick={() => {
                                                    onRedirect && (onRedirect(`${typeof prod === "object" ? prod?.serial : prod}`));
                                                    history.push(`/assets/${typeof prod === "object" ? prod?.serial : prod}`);
                                                }}
                                            >{typeof prod === "object" ? `${prod?.serial} (${prod?.type})` : prod}</span>
                                        </Typography>)
                                }
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1"><b>Details</b></Typography>
                                <Typography variant="body1">
                                    {
                                        (event.eventData?.link && event.eventData.details.split(event.eventData.link).length === 2) ?
                                            [
                                                event.eventData.details.split(event.eventData.link)[0],
                                                <span 
                                                className={classes.detailsLink}
                                                onClick={() => {
                                                    onRedirect && (onRedirect());
                                                    history.push(`/assets/${event.eventData.link}`);
                                                }}>
                                                    {event.eventData.link}
                                                </span>,
                                                event.eventData.details.split(event.eventData.link)[1]
                                            ]
                                            : event.eventData.details
                                    }
                                </Typography>
                            </Grid>

                        </Grid>
                        : null
                }
            </DialogContent>
        </Dialog >
    );

};

EventDetailsViewer.propTypes = {
    event: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onRedirect: PropTypes.func
};

export default EventDetailsViewer;