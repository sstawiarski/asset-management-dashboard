import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

//Icons
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';

const useStyles = makeStyles(theme => ({
    bar: {
        backgroundColor: "rgba(255, 219, 89, 0.36)",
        borderRadius: "25rem",
        minWidth: "40px",
        display: "flex",
        maxWidth: "5rem",
        border: "1px solid #F9C104"
    },
    count: {
        cursor: "default",
        textOverflow: "ellipsis"
    },
    warningIcon: {
        color: "#EBBA00",
        fontSize: "1em",
        marginTop: "3px"
    }
}))

const WarningIndicator = ({ warnings, label }) => {
    const classes = useStyles();

    return (
        <Tooltip
            title={
                <React.Fragment>
                    {/* Render out the array of warning strings supplied as props into the tooltip */}
                    <Typography variant="body2"><b>{warnings.length} warning{warnings.length === 1 ? "" : "s"}</b></Typography>
                    {
                        warnings.map((warning, idx) => <Typography key={idx} variant="body2">{warning}</Typography>)
                    }
                </React.Fragment>
            }>

            {/* Display warning symbol with the count of the number of warnings generated */}
            <Grid container className={classes.bar} direction="row" justify="space-evenly" onClick={(event) => event.stopPropagation()}>
                <Grid item xs={5} md={4}>
                    <WarningOutlinedIcon className={classes.warningIcon} />
                </Grid>
                <Grid item xs={5} md={4}>
                    <div style={{ display: "block", width: "100%" }}>
                        <Typography variant="body2" className={classes.count}>{label ? label : warnings ? warnings.length : null}</Typography>
                    </div>
                </Grid>
            </Grid>

        </Tooltip>
    );
};

WarningIndicator.propTypes = {
    /**
     * An array of warning message strings
     */
    warnings: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.string)])
}

export default WarningIndicator;