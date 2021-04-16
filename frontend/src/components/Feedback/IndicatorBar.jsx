import React from 'react';
import PropTypes from 'prop-types'

//Material-UI Components
import Grid from '@material-ui/core/Grid';

//Custom Components
import WarningIndicator from './WarningIndicator';
import ErrorIndicator from './ErrorIndicator';

const IndicatorBar = ({ warnings, errors, errorLabel, warningLabel, errorLength }) => {
    return (
        <Grid container direction="row" spacing={2} justify="space-evenly">
            {
                errors !== null && errors.length ?
                    <Grid item xs={12} md={(warnings !== null && warnings.length) ? 6 : 12}>
                        <ErrorIndicator errors={errors} label={errorLabel} errorLength={errorLength} />
                    </Grid>
                    : null
            }
            {
                warnings !== null && warnings.length ?
                    <Grid item xs={12} md={(errors !== null && errors.length) ? 6 : 12}>
                        <WarningIndicator warnings={warnings} label={warningLabel} />
                    </Grid>
                    : null
            }
        </Grid>
    );
};

IndicatorBar.propTypes = {
    /**
     * An array of warning message strings
     */
    warnings: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.string)]),
    /**
     * An array of error message strings
     */
    errors: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.string)]),
    /**
     * Error indicator label override
     */
    errorLabel: PropTypes.string,
    /**
     * Warning indicator label override
     */
    warningLabel: PropTypes.string,
}

export default IndicatorBar;