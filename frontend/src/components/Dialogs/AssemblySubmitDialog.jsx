import React from 'react';

import { makeStyles } from '@material-ui/core/styles'
import { Grid, DialogTitle, DialogContent, Typography, Box } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';

import SimpleList from '../Tables/SimpleList';

const AssemblySubmitDialog = ({ open, setOpen, onSuccess, onFailure, isComplete, submission, handleCancel }) => {

    let success = false;

    const handleSubmit = () => {
        setOpen(false);
        if (success) {
            onSuccess();
        } else {
            onFailure();
        }
    }

    return (
        <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
            
            <DialogTitle>Submit Assembly</DialogTitle>

            <DialogContent>
                <Grid container justify="center" alignItems="flex-start" direction="row">
                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><b>Type:</b></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">{submission.type}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><b>Serial:</b></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">{submission.serial}</Typography>
                    </Grid>

                    <Grid item xs={12} style={{marginTop: "20px"}}>
                        <Typography variant="subtitle1"><b>Manifest:</b></Typography>
                    </Grid>

                    <Grid item xs={8} style={{marginTop: "20px"}}>
                        <SimpleList data={submission.assets} label="assembly-manifest" headers={["Serial", "Name"]} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
          </Button>
                <Button onClick={handleSubmit} color="primary">
                    Submit
          </Button>
            </DialogActions>
            {!isComplete ? <Alert severity="warning">Assembly is incomplete -- you have chosen to override. </Alert> : null}
        </Dialog>
    )
}

export default AssemblySubmitDialog;