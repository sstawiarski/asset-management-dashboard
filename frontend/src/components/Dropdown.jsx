import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles'
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
}

const useStyles = makeStyles((theme) => ({
    button: {
        cursor: "pointer"
    },
}))

const Dropdown = ({ text, data }) => {

    const classes = useStyles();
    const [expand, toggleExpand] = useState(false);

    return (
        <>
            <Grid container direction="row">
                <Grid item>
                    <Typography variant="subtitle2">{text}</Typography>
                </Grid>
                <Grid item>
                    {
                        expand ?
                            <KeyboardArrowDown className={classes.button} onClick={() => toggleExpand(!expand)} />
                            : <KeyboardArrowRight className={classes.button} onClick={() => toggleExpand(!expand)} />
                    }
                </Grid>
            </Grid>
            <div>
                { expand ? JSON.stringify(data) : null }
            </div>
        </>
    );
};

export default Dropdown;