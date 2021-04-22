import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

//Library Tools
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Components
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

//Dialogs
import EventDetailsViewer from '../Dialogs/GeneralDialogs/EventDetailsViewer';

//Icons
import AddIcon from '@material-ui/icons/Add'; //creation
import ExtensionIcon from '@material-ui/icons/Extension'; //assembly modification
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import BlockIcon from '@material-ui/icons/Block'; //retirement
import ReceiptIcon from '@material-ui/icons/Receipt'; //change owner
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'; //reassignment
import AssignmentIcon from '@material-ui/icons/Assignment'; //assignment type
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed'; //group tag
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn'; //incoming AND outgoing shipments
import CancelIcon from '@material-ui/icons/Cancel'; //removal of child assets
import LocationOnIcon from '@material-ui/icons/LocationOn'; //location change
import RemoveIcon from '@material-ui/icons/Remove'; //removal from assembly

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
    },
    moreEventsButton: {
        marginLeft: "50%",
        marginRight: "50%",
        fontSize: "32px",
        width: "40px",
        marginTop: "20px",
        backgroundColor: "#DDDDDD",
        color: "#AAAAAA",
        borderRadius: "3px",
        cursor: "pointer"
    }
});

/**
 * Retreive the correct icon to display by the event based on the event key
 * @param {*} eventType The event key
 */
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
        case "REM":
            return (<CancelIcon style={classes.icon} />);
        case "CRE":
            return (<AddIcon style={classes.icon} />);
        case "ACR":
            return (<AddIcon style={classes.icon} />);
        case "ABM":
            return (<ExtensionIcon style={classes.icon} />);
        case "LOC":
            return (<LocationOnIcon style={classes.icon} />);
        case "ASRM":
            return (<RemoveIcon style={classes.icon} />);
        default:
            return null;
    }
};

const AssetTimeline = ({ data, onMore, empty, onRedirect }) => {
    const classes = useStyles();
    const history = useHistory();

    const [event, setEvent] = useState(null);

    return (
        <>
            <Timeline align="alternate">
                {
                    data.length ? data.map((item, idx) => {
                        const isShipment = item.eventType.includes('Shipment');
                        const ChosenIcon = isShipment ? getIcon(item.eventType) : getIcon(item.key);

                        return (
                            <TimelineItem key={idx}>
                                <TimelineSeparator>
                                    {/* Render different colors for the icons depending on their index */}
                                    {
                                        idx % 3 === 0 ?
                                            <TimelineDot>{ChosenIcon}</TimelineDot>
                                            : idx % 2 === 0 ?
                                                <TimelineDot color="secondary">{ChosenIcon}</TimelineDot>
                                                : <TimelineDot color="primary">{ChosenIcon}</TimelineDot>
                                    }

                                    {/* Display trailing connecting line if there is another event after the current one */}
                                    {
                                        idx !== data.length - 1 ?
                                            <TimelineConnector />
                                            : null
                                    }
                                </TimelineSeparator>
                                <TimelineContent>
                                    {/* Add event info if it is a regular event, link to shipment if it is a shipment */}
                                    <Tooltip disableHoverListener={isShipment} title="View event details" arrow>
                                        <Paper className={isShipment ? "shipment-event" : classes.eventTag} onClick={() => {
                                            if (!isShipment) setEvent(item);
                                        }}>
                                            <div style={{ padding: "10px" }}>
                                                <Typography variant="subtitle1"><b>{new Date(item.eventTime).toLocaleDateString('en-US', dateOptions)}</b></Typography>
                                                <Typography variant="body1">{item.key}</Typography>
                                                <Typography variant="body1">{item.eventType}</Typography>
                                                {
                                                    isShipment ?
                                                        <Button style={{ fontSize: "0.7rem", color: "#3CB3E6" }} onClick={() => history.push(`/shipments/${item.key}`)}>View shipment</Button>
                                                        : null
                                                }
                                            </div>
                                        </Paper>
                                    </Tooltip>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })
                        : null
                }
            </Timeline>

            {/* Display 'More' button icon for event timeline pagination */}
            {
                !empty ?
                    <Tooltip title="View More" placement="bottom">
                        <MoreHorizIcon className={classes.moreEventsButton} onClick={onMore} />
                    </Tooltip>
                    : <Typography variant="subtitle2">No remaining events</Typography>
            }
            <EventDetailsViewer
                event={event}
                open={Boolean(event)}
                onClose={() => setEvent(null)}
                onRedirect={onRedirect} />
        </>
    );
};

AssetTimeline.propTypes = {
    data: PropTypes.array,
    onMore: PropTypes.func,
    /** Function to run when the event details viewer redirects the user on click of a serial */
    onRedirect: PropTypes.func,
    empty: PropTypes.bool
};

export default AssetTimeline;