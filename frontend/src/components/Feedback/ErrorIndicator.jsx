import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

//Icons
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles(theme => ({
    bar: {
        backgroundColor: "rgba(255, 1, 3, 0.26)",
        borderRadius: "25rem",
        minWidth: "40px",
        display: "flex",
        border: "1px solid #EB0509"
    },
    count: {
        cursor: "default"
    },
    errorIcon: {
        color: "#B80002",
        fontSize: "1em",
        marginTop: "3px"
    }
}))

const ErrorIndicator = ({ errors, label, errorLength }) => {
    const classes = useStyles();

    return (
        <Tooltip
            title={
                <React.Fragment>
                    {/* Render out the array of warning strings supplied as props into the tooltip */}
                    <Typography variant="body2"><b>{errorLength || errors.length} error{((errorLength && errorLength === 1) || errors.length === 1) ? "" : "s"}</b></Typography>
                    {
                        errors.map(warning => <Typography variant="body2">{warning}</Typography>)
                    }
                </React.Fragment>
            }>

            {/* Display warning symbol with the count of the number of warnings generated */}
            <Grid container className={classes.bar} direction="row" justify="space-evenly" onClick={(event) => event.stopPropagation()}>
                <Grid item xs={5} md={4}>
                    <ErrorOutlineIcon className={classes.errorIcon} />
                </Grid>
                <Grid item xs={5} md={4}>
                    <div style={{ display: "block", width: "100%" }}>
                        <Typography variant="body2" className={classes.count} noWrap>{label ? label : errors ? (errorLength || errors.length) : null}</Typography>
                    </div>

                </Grid>
            </Grid>

        </Tooltip>
    );
};

ErrorIndicator.propTypes = {
    /**
     * An array of warning message strings
     */
    errors: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.string)])
}

export default ErrorIndicator;