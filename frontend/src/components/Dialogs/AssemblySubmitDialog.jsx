import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce'
import { Grid, DialogTitle, DialogContent, Typography, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import SimpleList from '../Tables/SimpleList';
import CircularProgress from '@material-ui/core/CircularProgress';

const AssemblySubmitDialog = ({ open, onSuccess, onFailure, isComplete, submission, handleCancel }) => {
    const [serial, setSerial] = useState("");
    const [error, setError] = useState("");
    const [good, setGood] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const debounced = useRef(debounce((ser) => {

        fetch(`http://localhost:4000/assets/${ser}`)
        .then(response => {
            if (ser.length === 0) {
                setLoading(false);
                return;
            }
            if (response.status === 200) {
                setError("Serial already exists in database!");
            } else {
                setGood("Serial will be provisioned upon submission");
            }
            setLoading(false);
        });
    }, 1000));

    useEffect(() => {
        if (serial === "") {
            setGood(null);
            setError("");
            setLoading(false);
            return;
        }
        if (serial.length <= 3) return;

        const lastIndex = serial.lastIndexOf('-') === -1 ? serial.length-1 : serial.lastIndexOf('-') + 1;
        const secondPart = serial.substring(lastIndex, serial.length);
        if (!secondPart) {
            setError("Serial is missing trailing numbers")
            return;
        }
        setLoading(true);
        debounced.current(serial);
    }, [serial])

    const handleChange = (event) => {
        setGood(null);
        setError("");
        const { value } = event.target;
        const re = /^[A-Za-z0-9-]*$/;
        if (!value.match(re)) {
            setError("Serial does not match standard format");
            return;
        }

        if (value.length <= 3 && value.length !== 0) {
            setError("Serial length must be at least 3 characters");
            setSerial(value);
            return;
        }
        
        const index = value.lastIndexOf('-') === -1 ? value.length : value.lastIndexOf('-') + 1;
        const firstPart = value.substring(0, index);
        
        if (firstPart !== submission.serializationFormat && value.length !== 0) {
            setError("Serial does not match format for assembly type");
            setSerial(value);
            return;
        }
        setSerial(value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!serial) {
            setError("No serial entered!");
            return;
        } else if (serial.split("-")[0] !== submission.serializationFormat.split("-")[0]) {
            setError("Entered serial does not match format for assembly type");
            return;
        }

        try {
            const actualItems = submission.assets.map(entry => entry[0]);
            const submit = {
                assets: actualItems,
                type: submission.type,
                missingItems: submission.missingItems,
                owner: submission.owner,
                groupTag: submission.groupTag,
                override: submission.override,
                serial: serial
            }
            fetch("http://localhost:4000/assets/create-Assembly", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(submit)
            }).then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return null;
                }
            })
                .then(json => {
                    if (json) {
                        onSuccess();
                    } else {
                        onFailure();
                    }
                    handleCancel();
                })

        } catch (e) {
            console.log(e)
        }
    }



    return (
        <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">

            <DialogTitle>Submit Assembly</DialogTitle>

            <DialogContent>
                <Grid container justify="center" alignItems="flex-start" direction="row">
                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><b>Type</b></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">{submission.type}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><b>Serial</b></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl variant="outlined" size="small">
                            <InputLabel htmlFor="outlined-adornment"></InputLabel>
                            <OutlinedInput
                                id="outlined-adornment"
                                error={error}

                                value={serial}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        {isLoading ? <CircularProgress style={{width: "25px", height: "25px"}}/> : error ? <CloseIcon style={{color: "red"}}/> : good ? <DoneIcon style={{color: "#1b9e37" }} /> : null}
                                    </InputAdornment>
                                }
                                labelWidth={0}
                            />
                        </FormControl>

                        {
                            error ?
                                <>
                                    <br />
                                    <Typography variant="caption" style={{color: "red"}}>Error: {error}</Typography>
                                </>
                                : null
                        }

                        {
                            (good && !error) ?
                            <>
                            <br />
                                <Typography variant="caption">{good}</Typography>
                                </>
                                : null
                        }
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        <Typography variant="subtitle1"><b>Manifest</b></Typography>
                    </Grid>

                    <Grid item xs={8} style={{ marginTop: "20px" }}>
                        {submission.assets ? <SimpleList data={submission.assets} label="assembly-manifest" headers={["Serial", "Name"]} /> : null}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
          </Button>
                <Button onClick={handleSubmit} type="submit" color="primary">
                    Submit
          </Button>
            </DialogActions>
            {!isComplete ? <Alert severity="warning">Assembly is incomplete -- you have chosen to override. </Alert> : null}
        </Dialog>
    )
}

export default AssemblySubmitDialog;