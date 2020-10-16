import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid'
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Paper, Typography, Button } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';

import Dropdown from './Dropdown';

import { makeStyles } from '@material-ui/core/styles'

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
                    <TimelineItem>
                        <TimelineSeparator>
                            {idx % 3 === 0 ? <TimelineDot /> : idx % 2 === 0 ? <TimelineDot color="secondary" /> : <TimelineDot color="primary" />}
                            {idx !== data.length - 1 ? <TimelineConnector /> : null}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper>
                                <div style={{ padding: "10px" }}>
                                    <Typography variant="subtitle1"><b>{item.eventDate.toLocaleDateString('en-US', dateOptions)}</b></Typography>
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