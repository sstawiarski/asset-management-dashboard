import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import debounce from 'lodash/debounce'

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';

//Icons
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import SearchIcon from '@material-ui/icons/Search';

//Custom Components
import SimpleList from '../../Tables/SimpleList';

//Tools
import useLocalStorage from '../../../utils/auth/useLocalStorage.hook';

const AssemblySubmitDialog = ({ open, onSuccess, onFailure, isComplete, submission, handleCancel }) => {

    const [serial, setSerial] = useState(""); //user-entered serial if not a modification
    const [error, setError] = useState(""); //error status of user-entered serial
    const [good, setGood] = useState(null); //success status of user-entered serial
    const [isLoading, setLoading] = useState(false); //loading icon

    const [user,] = useLocalStorage('user', {});

    /* Debounced serial checker to avoid spamming the server */
    const debounced = useRef(debounce((ser) => {
        fetch(`${process.env.REACT_APP_API_URL}/assets/${ser}`)
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

    /* Handle basic serial sanitization, error messages, and trigger debounced search */
    useEffect(() => {
        if (serial === "") {
            setGood(null);
            setError("");
            setLoading(false);
            return;
        }
        if (serial.length <= 3) return;

        const lastIndex = serial.lastIndexOf('-') === -1 ? serial.length - 1 : serial.lastIndexOf('-') + 1;
        const secondPart = serial.substring(lastIndex, serial.length);
        if (!secondPart) {
            setError("Serial is missing trailing numbers")
            return;
        }
        setLoading(true);
        debounced.current(serial);
    }, [serial]);

    /* Handle serial change and full validity checks, including schema matching */
    //TODO: Update this with the same verification methods as the Create Asset dialog
    const handleChange = (event) => {
        setGood(null);
        setError("");
        const { value } = event.target;

        //basic format check
        const re = /^[A-Za-z0-9-]*$/;
        if (!value.match(re)) {
            setError("Serial does not match standard format");
            return;
        }

        //length check
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

    /* Check errors one last time and then submit as either PATCH or POST depending on whether assembly is being modified */
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!serial && !submission.serial) {
            setError("No serial entered!");
            return;
        } else if (serial.split("-")[0] !== submission.serializationFormat.split("-")[0] && !submission.serial) {
            setError("Entered serial does not match format for assembly type");
            return;
        }

        try {
            const actualItems = submission.assets.map(entry => entry[0]);
            const submit = submission.reassembling ? {
                assets: actualItems,
                serial: submission.serial,
                missingItems: submission.missingItems,
                user: user.uniqueId
            } : {
                assets: actualItems,
                type: submission.type,
                missingItems: submission.missingItems,
                owner: submission.owner,
                groupTag: submission.groupTag,
                serial: serial,
                user: user.uniqueId
            };


            fetch(`${process.env.REACT_APP_API_URL}/assets/assembly`, {
                method: submission.reassembling ? 'PATCH' : 'POST',
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
                    setSerial("");
                    handleCancel();
                });

        } catch (e) {
            console.log(e)
        }

    }

    return (
        <Dialog open={open} onClose={() => { handleCancel(); setSerial(""); }} aria-labelledby="form-dialog-title">

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
                    {
                        submission.reassembling ?
                            <Grid item xs={6}>
                                <Typography variant="subtitle1">{submission.serial}</Typography>
                            </Grid>
                            :
                            <Grid item xs={6}>
                                <FormControl variant="outlined" size="small">
                                    <InputLabel htmlFor="outlined-adornment"></InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment"
                                        error={Boolean(error)}
                                        value={serial}
                                        placeholder={submission?.serializationFormat + "XXXX" || ""}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {isLoading ? <CircularProgress style={{ width: "25px", height: "25px" }} /> : error ? <CloseIcon style={{ color: "red" }} /> : good ? <DoneIcon style={{ color: "#1b9e37" }} /> : <SearchIcon style={{ color: "rgba(0,0,0,0.54)" }} />}
                                            </InputAdornment>
                                        }
                                        labelWidth={0}
                                    />
                                </FormControl>

                                {/* Serial has an error */}
                                {
                                    error ?
                                        <>
                                            <br />
                                            <Typography variant="caption" style={{ color: "red" }}>Error: {error}</Typography>
                                        </>
                                        : null
                                }

                                {/* Display message when serial is accepted */}
                                {
                                    (good && !error) ?
                                        <>
                                            <br />
                                            <Typography variant="caption">{good}</Typography>
                                        </>
                                        : null
                                }
                            </Grid>
                    }


                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                        <Typography variant="subtitle1"><b>Manifest</b></Typography>
                    </Grid>

                    <Grid item xs={8} style={{ marginTop: "20px" }}>
                        {
                            submission.assets ?
                                <SimpleList data={submission.assets} label="assembly-manifest" headers={["Serial", "Name"]} />
                                : null
                        }
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleCancel(); setSerial(""); }} color="primary">
                    Cancel
          </Button>
                <Button onClick={handleSubmit} type="submit" color="primary">
                    Submit
          </Button>
            </DialogActions>

            {/* Override confirmation message */}
            {
                !isComplete ?
                    <Alert severity="warning">Assembly is incomplete -- you have chosen to override. </Alert>
                    : null
            }
        </Dialog>
    )
}

AssemblySubmitDialog.propTypes = {
    open: PropTypes.bool,
    onSuccess: PropTypes.func, 
    isComplete: PropTypes.bool,
    submission: PropTypes.object,
    handleCancel: PropTypes.func
}

export default AssemblySubmitDialog;