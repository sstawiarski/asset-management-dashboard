import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const useStyles = makeStyles((theme) => ({
    item: {
    },
    formControl: {
        marginBottom: theme.spacing(2),
        minWidth: 180,
        marginLeft: "20px"
    },
    entry: {
        marginLeft: "20px"
    },
    error: {

    },
    range: {
        marginLeft: "20px",
        width: "40%"
    },
    owner: {
        marginBottom: theme.spacing(2),
        minWidth: 240,
        marginLeft: "20px",
        marginTop: theme.spacing(4)
    },
}));

const CreateManifestDialog = ({ open, setOpen, onSuccess, onSemiSuccess }) => {
    const classes = useStyles();

    const [createdBy, setCreatedBy] = useState("");
    const [created, setCreated] = useState("");
    const [updated, setUpdated] = useState("");
    const [completed, setCompleted] = useState("");
    const [status, setStatus] = useState("");
    const [shipmentType, setShipmentType] = useState("");
    const [shipFrom, setShipFrom] = useState("");
    const [shipTo, setShipTo] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [contractId, setContractId] = useState("");
    const [manifest, setManifest] = useState("");

    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose} aria-labelledby="create-manifest-dialog-title">



            <DialogTitle id="create-manifest-dialog-title">Create Manifests</DialogTitle>

            <DialogContent>

            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
            >
                <ToggleButton value="left" aria-label="Incoming">
                    <FormatAlignLeftIcon />
                </ToggleButton>
                
                <ToggleButton value="right" aria-label="Outgoing">
                    <FormatAlignRightIcon />
                </ToggleButton>

                <ToggleButton value="justify" aria-label="justified" disabled>
                    <FormatAlignJustifyIcon />
                </ToggleButton>

            </ToggleButtonGroup>
  


                <div className={classes.item}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="manifest-type-label">Manifest Name</InputLabel>

                        <Select
                            labelId="manifest-type-label"
                            labelWidth={105}
                            id="manifest-type-label"
                            error={missingType}
                            value={schema}
                            onChange={(event) => { 
                                if (missingType) setMissingType(false);
                                setSchema(event.target.value) 
                            }}
                        >
                            {options ? options.map((option, key) => <MenuItem key={key} value={option.name}>{option.name}</MenuItem>) : null}

                        </Select>
                    </FormControl>
                    <FormControl component="fieldset" className={classes.entry}>
                        <FormLabel component="legend">Method</FormLabel>
                        <RadioGroup row aria-label="method" name="method" value={entryType} onChange={handleEntryTypeChange}>
                            <FormControlLabel value="range" control={<Radio />} label="Range" />
                            <FormControlLabel value="list" control={<Radio />} label="List" />
                        </RadioGroup>
                    </FormControl>
                    <br />
                    {entryType === "list"
                        ?
                        <div className={classes.entry}>
                            <TextField
                                id="serial-list"
                                style={{ width: "100%" }}
                                multiline
                                rows={6}
                                variant="outlined"
                                error={!serialEntered}
                                value={serials}
                                onChange={(event) => { 
                                    if (!serialEntered) setEntered(true);
                                    setSerials(event.target.value) 
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        console.log(serials)
                                    }
                                }}>

                            </TextField>
                            {incorrect.length > 0 ?
                                <>
                                    <Typography variant="subtitle1" style={{ color: "red" }}><b>ERROR: Some serials are incorrectly formatted:</b></Typography>
                                    <ul>
                                        {incorrect.map(item => <><li key={item.serial}>{item.serial} (line {item.line})</li></>)}
                                    </ul>
                                </>
                                : null}
                        </div>
                        :
                        <div>
                            <TextField
                                className={classes.range}
                                variant="outlined"
                                value={beginRange}
                                onChange={(event) => { 
                                    if (missingBegin) setMissingBegin(false);
                                    setBeginRange(event.target.value) 
                                }}
                                error={re.test(beginRange) ? false : beginRange !== "" ? true : missingBegin ? true : false}
                            />
                            <span style={{ display: "inline-block", padding: "15px 0px 15px 15px", marginRight: "-5px" }}> to </span>
                            <TextField
                                className={classes.range}
                                variant="outlined"
                                value={endRange}
                                onChange={(event) => { 
                                    if (missingEnd) setMissingEnd(false);
                                    setEndRange(event.target.value) 
                                }}
                                error={re.test(endRange) ? false : endRange !== "" ? true : missingEnd ? true : false}
                            />
                        </div>
                    }

                    <FormControl variant="outlined" className={classes.owner}>
                        <InputLabel id="manifest-type-label">Owner</InputLabel>
                        <Select
                            labelId="owner-label"
                            labelWidth={105}
                            fullWidth
                            id="owner-label"
                            value={owner}
                            defaultValue="Supply Chain-USA"
                            onChange={(event) => setOwner(event.target.value)}
                        >
                            {/* TODO: De-hardcode */}
                            <MenuItem value="Supply Chain-USA">Supply Chain-USA</MenuItem>
                            <MenuItem value="Supply Chain-CA">Supply Chain-CA</MenuItem>

                        </Select>
                    </FormControl>
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} type="submit" color="primary">
                    Submit
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default CreateManifestDialog;