import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import EventDetailsViewer from './EventDetailsViewer';

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
}

const useStyles = makeStyles({
    eventTag: {
        transition: "all .3s ease",
        WebkitTransition: "all .3s ease",
        "&:hover": {
            backgroundColor: "#EAEAEA",
            cursor: "pointer",
            transition: "all .3s ease",
            WebkitTransition: "all .3s ease"
        }
    }
})

const AssetTimeline = ({ data }) => {
    const classes = useStyles();

    const [event, setEvent] = useState(null);

    return (
        <>
            <Timeline align="alternate">
                {data.length ? data.map((item, idx) => {
                    const isShipment = item.eventType.includes('Shipment');
                    return (
                        <TimelineItem key={idx}>
                            <TimelineSeparator>
                                {idx % 3 === 0 ? <TimelineDot /> : idx % 2 === 0 ? <TimelineDot color="secondary" /> : <TimelineDot color="primary" />}
                                {idx !== data.length - 1 ? <TimelineConnector /> : null}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Tooltip disableHoverListener={isShipment} title="View event details" arrow>
                                    <Paper className={classes.eventTag} onClick={() => {
                                        if (!isShipment) setEvent(item);
                                        }}>
                                        <div style={{ padding: "10px" }}>
                                            <Typography variant="subtitle1"><b>{new Date(item.eventTime).toLocaleDateString('en-US', dateOptions)}</b></Typography>
                                            <Typography variant="body1">{item.key}</Typography>
                                            <Typography variant="body1">{item.eventType}</Typography>
                                            {
                                                isShipment ?
                                                    <Button style={{ fontSize: "0.7rem", color: "#3CB3E6" }}>View shipment document</Button>

                                                    : null
                                            }
                                        </div>
                                    </Paper>
                                </Tooltip>
                            </TimelineContent>
                        </TimelineItem>
                    );
                }) : null}
            </Timeline>
            <EventDetailsViewer event={event} open={Boolean(event)} onClose={() => setEvent(null)} />
        </>
    );
};

export default AssetTimeline;