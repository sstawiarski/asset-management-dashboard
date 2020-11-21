import React from 'react';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Dropdown from './Dropdown';

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
}

const AssetTimeline = ({ data }) => {
    return (
        <Timeline align="alternate">
            {data.length ? data.map((item, idx) => {
                return (
                    <TimelineItem key={idx}>
                        <TimelineSeparator>
                            {idx % 3 === 0 ? <TimelineDot /> : idx % 2 === 0 ? <TimelineDot color="secondary" /> : <TimelineDot color="primary" />}
                            {idx !== data.length - 1 ? <TimelineConnector /> : null}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper>
                                <div style={{ padding: "10px" }}>
                                    <Typography variant="subtitle1"><b>{new Date(item.eventTime).toLocaleDateString('en-US', dateOptions)}</b></Typography>
                                    <Typography variant="body1">{item.key}</Typography>
                                    <Typography variant="body1">{item.eventType}</Typography>
                                    {
                                        item.eventType.includes('Shipment') ?
                                            <Button style={{ fontSize: "0.7rem", color: "#3CB3E6" }}>View shipment document</Button>

                                            : item.eventData ?
                                                <Dropdown text="Event Data" data={item.eventData} />
                                                : null
                                    }
                                </div>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                );
            }) : null}
        </Timeline>
    );
};

export default AssetTimeline;