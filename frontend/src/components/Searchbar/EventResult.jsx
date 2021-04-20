import React, { useState } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom';

//Material-UI Components
import Typography from '@material-ui/core/Typography';
import Portal from '@material-ui/core/Portal';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

//Custom Components
import EventDetailsViewer from '../Dialogs/GeneralDialogs/EventDetailsViewer';

//Icons
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

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
    associatedProduct: {
        cursor: "pointer",
        width: "fit-content",
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

const EventResult = ({ data }) => {
    const classes = useStyles();
    const history = useHistory();

    const [showProducts, toggleProducts] = useState(false);
    const [showDetails, toggleShowDetails] = useState(false);

    const container = React.useRef(null); //location of events dropdown to open

    return (
        <>
            <div className={classes.root}>
                <div className={classes.searchItem}>
                    <div style={{ marginLeft: '5px' }} onClick={() => {
                        /* Link to the Shipment Details page if the event is a shipment, otherwise display event viewer */
                        if (data && (data.eventType === "Incoming Shipment" || data.eventType === "Outgoing Shipment")) {
                            history.push(`/shipments/${data.key}`)
                        }
                        else toggleShowDetails(true);
                    }}>
                        <Typography variant="body1"><b>{data.key}</b></Typography>
                        <Typography variant="body2">{data.eventType}</Typography>
                        <Typography variant="body2">{new Date(data.eventTime).toLocaleDateString('en-US', dateOptions)}</Typography>
                    </div>
                </div>
                <div style={{ marginLeft: '5px' }}>

                    {/* Dropdown for associated assets */}
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

                    {/* Event's associated assets */}
                    {
                        showProducts && data.productIds.length ?
                            <Portal container={container.current}>
                                <div className={classes.events}>

                                    {
                                        data.productIds.map(product => {
                                            return (
                                                <Typography
                                                    variant="body2"
                                                    className={classes.associatedProduct}
                                                    key={product}
                                                    onClick={() => history.push(`/assets/${product}`)}>
                                                    <b>{product}</b>
                                                </Typography>
                                            )
                                        })
                                    }
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

EventResult.propTypes = {
    /**
     * An event document
     */
    data: PropTypes.object.isRequired
};

export default EventResult;