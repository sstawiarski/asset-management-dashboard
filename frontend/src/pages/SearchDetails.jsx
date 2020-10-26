import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({

});

const SearchDetails = (props) => {
    const searchTerm = props.match.params.query;

    useEffect(() => {

    }, [props.match.params.query])

    return (
    <div>
    </div>
    )
};

export default SearchDetails;