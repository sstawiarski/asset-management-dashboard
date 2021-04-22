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


const AssetEditWarning = ({ open, setOpen, items, handleOverride, containsAssemblies = false }) => {
    const classes = useStyles();
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>Editing Assembly Children</DialogTitle>

            <DialogContent className={classes.root}>
                <Grid container justify="center" alignItems="center" direction="column">
                    <Grid item xs={12}>
                        <WarningIcon className={classes.warning} />
                    </Grid>
                    <Grid item xs={12}>
                        {
                            containsAssemblies ?
                                <>
                                    <Typography variant="h6">Current selections include 1 or more assemblies -- editing will also update their children.</Typography>
                                    <Typography variant="h6">Editing {items.length > 1 ? "these assets" : "this asset"} will remove {items.length > 1 ? "them from their parent assemblies" : "it from its parent assembly"}.</Typography>
                                </>
                                : <Typography variant="h6">Editing {items.length > 1 ? "these assets" : "this asset"} will remove {items.length > 1 ? "them from their parent assemblies" : "it from its parent assembly"}.</Typography>
                        }
                    </Grid>
                    <Grid item xs={12} className={classes.container}>
                        <SimpleList data={items} label="items" headers={["Serial"]} />
                    </Grid>
                    <Grid item xs={12} className={classes.confirm}>
                        <Typography variant="body1">Do you wish to override this warning?</Typography>
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
}

AssetEditWarning.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    items: PropTypes.array,
    handleOverride: PropTypes.func
}

export default AssetEditWarning;