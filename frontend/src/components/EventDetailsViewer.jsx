import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric"
}

const useStyles = makeStyles({
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
        "&:hover": {
            backgroundColor: "#BDBDBD",
            borderRadius: "3px"
        }
    }
})

const EventDetailsViewer = ({ event, open, onClose }) => {
    const classes = useStyles();

    return (
        <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>Event Details</DialogTitle>
            <DialogContent className={classes.content}>
                {
                    event ?
                        <Grid container direction="row" justify="space-around" alignItems="center">
                            <Grid item xs={3} className={classes.item}>
                                <Typography variant="body1"><b>Event Key</b></Typography>
                                <Typography variant="body1">{event.key}</Typography>
                            </Grid>

                            <Grid item xs={5} className={classes.item}>
                                <Typography variant="body1"><b>Event Type</b></Typography>
                                <Typography variant="body1">{event.eventType}</Typography>
                            </Grid>

                            <Grid item xs={4} className={classes.item}>
                                <Typography variant="body1"><b>Event Time</b></Typography>
                                <Typography variant="body1">{new Date(event.eventTime).toLocaleString('en-US', dateOptions)}</Typography>
                            </Grid>

                            <Grid item xs={12} className={classes.item}>
                                <Typography variant="body1"><b>Affected Products</b></Typography>
                                {event.productIds.map(prod => <Typography variant="body1"><Link className={classes.link} to={`/assets/${prod}`}>{prod}</Link></Typography>)}
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1"><b>Details</b></Typography>
                                <Typography variant="body1">{event.eventData.details}</Typography>
                            </Grid>

                        </Grid>
                        : null
                }
            </DialogContent>
        </Dialog>
    );

};

export default EventDetailsViewer;