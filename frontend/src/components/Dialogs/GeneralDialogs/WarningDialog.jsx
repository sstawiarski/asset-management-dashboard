import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles'
import { Grid, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import SimpleList from '../../Tables/SimpleList';

import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles({
    warning: {
        fontSize: "100px",
        color: "#E5C92D"
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


const WarningDialog = ({ open, setOpen, items, handleOverride, text, title, headers }) => {
    const classes = useStyles();
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>{title}</DialogTitle>

            <DialogContent className={classes.root}>
                <Grid container justify="center" alignItems="center" direction="column">
                    <Grid item xs={12}>
                        <WarningIcon className={classes.warning} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">{text}</Typography>
                    </Grid>
                    {items ?
                        <Grid item xs={12} className={classes.container}>
                            <SimpleList data={items} label="items" headers={headers ? headers : ["Serial"]} />
                        </Grid>
                        : null}

                    <Grid item xs={12} className={classes.confirm}>
                        <Typography variant="body1">Do you wish to continue?</Typography>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
          </Button>
                <Button onClick={handleOverride} color="primary">
                    Override
          </Button>
            </DialogActions>
        </Dialog>
    )
};

WarningDialog.propTypes = {
    open: PropTypes.bool, 
    setOpen: PropTypes.func, 
    items: PropTypes.array, 
    handleOverride: PropTypes.func, 
    text: PropTypes.element, 
    title: PropTypes.element, 
    headers: PropTypes.array
}

export default WarningDialog;