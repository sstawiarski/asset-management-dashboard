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
import useLocalStorage from '../../../utils/auth/useLocalStorage.hook';

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

const CreateAssetDialog = ({ open, setOpen, onSuccess, onSemiSuccess }) => {
    const classes = useStyles();
    const [options, setOptions] = useState([]);
    const [serials, setSerials] = useState("");
    const [schema, setSchema] = useState("");
    const [incorrect, setIncorrect] = useState([]);
    const [entryType, setEntryType] = useState("range");
    const [beginRange, setBeginRange] = useState("");
    const [endRange, setEndRange] = useState("");
    const [owner, setOwner] = useState("");
    const [serialEntered, setEntered] = useState(true);
    const [missingType, setMissingType] = useState(false);
    const [missingBegin, setMissingBegin] = useState(false);
    const [missingEnd, setMissingEnd] = useState(false);
    const [missingOwner, setMissingOwner] = useState(false);
    const [user, ] = useLocalStorage('user', {});

    /* Fetches list of asset types for dropdown */
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/assets/schemas`)
            .then(res => res.json())
            .then(json => setOptions(json));
    }, [])


    const handleSubmit = (event) => {
        event.preventDefault();

        if (schema === "") {
            setMissingType(true);
            return;
        }

        if (entryType === "range" && (beginRange === "" || endRange === "")) {
            if (beginRange === "") setMissingBegin(true);
            if (endRange === "") setMissingEnd(true);
            return;
        }

        if (owner === "") {
            setMissingOwner(true);
            return;
        }

        /* setup data object to send based on API docs and required parameters */
        let data = {};

        if (entryType === "list") {
            if (serials === "") {
                setEntered(false);
                return;
            }
            //split up serials entered in text box
            const serial = serials.split('\n');
            if (serial[serial.length - 1] === '') serial.pop();

            //check serials to see if they match schema
            const check = options.filter(item => item.name === schema);
            const serialTest = check[0].serializationFormat.split("-");
            const badOnes = serial.filter(s => {
                if (check[0].name === "Gamma Sensor" || check[0].name === "Directional Sensor") {
                    const reg = new RegExp(check[0].serializationFormat);
                    return !reg.test(s);
                }

                const item = s.split('-');
                return item[0] !== serialTest[0];
            });

            const realBad = badOnes.map((item, idx) => {
                if (item === "") {
                    return {};
                } else {
                    return {
                        serial: item,
                        line: serial.indexOf(item) + 1
                    }
                }
            })

            if (realBad.length > 0) {
                if (Object.keys(realBad[0]).length === 0) {
                    setIncorrect([]);
                } else {
                    setIncorrect(realBad);
                    return;
                }
            } else {
                setIncorrect([]);
                data.type = entryType;
                data.list = serial;
                data.assetName = schema;
                data.owner = owner;
                data.user = user.uniqueId;
                sendData(data).then(res => {
                    if (res.invalid.length > 0) {
                        onSemiSuccess(res.invalid);
                    } else {
                        onSuccess(true, res.message);
                    }
                    handleClose();
                });
            }
        } else if (entryType === "range") {
            data.type = "range";
            data.serialBase = options.find(element => element.name === schema).serializationFormat;
            data.beginRange = beginRange;
            data.endRange = endRange;
            data.owner = owner;
            data.assetName = schema;
            data.user = user.uniqueId;
            sendData(data).then(res => {
                if (res.invalid.length > 0) {
                    onSemiSuccess(res.invalid);
                } else {
                    onSuccess(true, res.message);
                }
            });
            handleClose();
        }
    }

    const handleEntryTypeChange = (event) => {
        setEntryType(event.target.value);
        setSerials("");
        setBeginRange("");
        setEndRange("");
        setIncorrect([]);
        setMissingBegin(false);
        setMissingEnd(false);
        setMissingType(false);
        setEntered(true);
    }

    const sendData = async (data) => {
        //uses POST endpoint and sends the arguments in the body of the HTTP request
        const result = await fetch(`${process.env.REACT_APP_API_URL}/assets`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await result.json();
    }

    //reset dialog to default state on close
    const handleClose = () => {
        setOpen(false);
        setSerials("");
        setSchema("");
        setBeginRange("");
        setEndRange("");
        setEntered(true);
        setMissingBegin(false);
        setMissingEnd(false);
        setMissingType(false);
        setMissingOwner(false);
        setOwner("");
        setEntryType("range");
        setIncorrect([]);
    }

    const re = /^[0-9\b]+$/;


    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose} aria-labelledby="create-asset-dialog-title">



            <DialogTitle id="create-asset-dialog-title">Create Assets</DialogTitle>

            <DialogContent>


                <div className={classes.item}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="asset-type-label">Asset Name</InputLabel>

                        <Select
                            labelId="asset-type-label"
                            labelWidth={90}
                            id="asset-type-label"
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
                                >

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
                        <InputLabel id="asset-type-label">Owner</InputLabel>
                        <Select
                            labelId="owner-label"
                            labelWidth={50}
                            fullWidth
                            id="owner-label"
                            error={missingOwner}
                            value={owner}
                            defaultValue="Supply Chain-USA"
                            onChange={(event) => {
                                if (missingOwner) setMissingOwner(false);
                                setOwner(event.target.value);
                            }}
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

export default CreateAssetDialog;