import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles'
import { Grid, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import SimpleList from '../../Tables/SimpleList';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles({
    warning: {
        fontSize: "75px",
        color: "#e02d2d"
    },
    confirm: {
        marginTop: "40px"
    },
    header: {
        backgroundColor: "#EBEBEB"
    },
    body: {
        backgroundColor: "#FAFAFA",
        textDecoration: "none",
    },
    container: {
        marginTop: "20px"
    },
    table: {
        minWidth: "300px",
        flexGrow: 1
    },
    root: {
        padding: "0px 25px 0px 25px"
    }
})


const InvalidSerialsDialog = ({ open, setOpen, items }) => {
    const classes = useStyles();
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>Asset Creation Error</DialogTitle>

            <DialogContent className={classes.root}>
                <Grid container justify="center" alignItems="center" direction="column">
                    <Grid item xs={12}>
                        <ErrorOutlineIcon className={classes.warning} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">The following asset serials already exist in the system and could not be created:</Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.container}>
                        <SimpleList data={items} label="items" headers={["Serial"]} />
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    OK
          </Button>
            </DialogActions>
        </Dialog>
    )
};

InvalidSerialsDialog.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    items: PropTypes.array
}

export default InvalidSerialsDialog;