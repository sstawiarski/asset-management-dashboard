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
import BlockIcon from '@material-ui/icons/Block'; //retirement
import ReceiptIcon from '@material-ui/icons/Receipt'; //change owner
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'; //reassignment
import AssignmentIcon from '@material-ui/icons/Assignment'; //assignment type
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed'; //group tag
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn'; //incoming AND outgoing shipments
import Tooltip from '@material-ui/core/Tooltip';

import EventDetailsViewer from './EventDetailsViewer';

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
};

const useStyles = makeStyles({
    flipped: {
        transform: "scale (-1, 1)",
        transformOrigin: "center",
        color: "black"
    },
    icon: {
        color: "black"
    },
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
});

const getIcon = (eventType) => {
    const classes = {
        flipped: {
            transform: "scale (-1, 1)",
            transformOrigin: "center",
            color: "#F6F5F5"
        },
        icon: {
            color: "#F6F5F5",
            filter: "drop-shadow(1px 1px 1.5px #676666)"
        }
    }
    const event = eventType.split("-", 1)[0];
    switch (event) {
        case "RET":
            return (<BlockIcon style={classes.icon} />);
        case "REA":
            return (<AssignmentIndIcon style={classes.icon} />);
        case "OWN":
            return (<ReceiptIcon style={classes.icon} />);
        case "GRP":
            return (<DynamicFeedIcon style={classes.icon} />);
        case "ASN":
            return (<AssignmentIcon style={classes.icon} />);
        case "Incoming Shipment":
            return (<AssignmentReturnIcon style={classes.flipped} />)
        case "Outgoing Shipment":
            return (<AssignmentReturnIcon style={classes.icon} />);
        default:
            return null;
    }
};

const AssetTimeline = ({ data }) => {
    const classes = useStyles();
    const [event, setEvent] = useState(null);

    return (
        <>
        <Timeline align="alternate">
            {data.length ? data.map((item, idx) => {
                const isShipment = item.eventType.includes('Shipment');
                const ChosenIcon = isShipment ? getIcon(item.eventType) : getIcon(item.key);
                
                return (
                    <TimelineItem key={idx}>
                        <TimelineSeparator>
                            {idx % 3 === 0 ? 
                            
                            <TimelineDot>{ChosenIcon}</TimelineDot> 
                            
                            : idx % 2 === 0 ? 
                            <TimelineDot color="secondary">{ChosenIcon}</TimelineDot> 
                            
                            : <TimelineDot color="primary">{ChosenIcon}</TimelineDot>}

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