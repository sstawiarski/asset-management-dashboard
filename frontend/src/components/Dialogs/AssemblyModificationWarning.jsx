import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles'
import { Grid, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

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


const AssemblyModificationWarning = ({ open, setOpen, assembly }) => {
    const classes = useStyles();
    const history = useHistory();

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>Modifying Assembly</DialogTitle>

            <DialogContent className={classes.root}>
                <Grid container justify="center" alignItems="center" direction="column">
                    <Grid item xs={12}>
                        <WarningIcon className={classes.warning} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" style={{ textAlign: "center" }}>Modifying this assembly remove all of its child assets</Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.confirm}>
                        <Typography variant="body1">Do you wish to continue?</Typography>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Link to={{
                    pathname: '/assets/create-assembly',
                    state: {
                        isAssemblyEdit: true,
                        serial: assembly.serial,
                        assemblyType: assembly.assetName
                    }
                }}
                style={{ textDecoration: "none" }}>
                    <Button color="primary">Modify</Button>
                </Link>

            </DialogActions>
        </Dialog>
    )
}

export default AssemblyModificationWarning;