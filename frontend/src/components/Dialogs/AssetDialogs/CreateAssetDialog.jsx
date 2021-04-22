import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import { makeStyles } from '@material-ui/core/styles';

//Material-UI Components
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
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';

//Tools
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
    dropdown: {
        marginBottom: theme.spacing(1),
        width: "80%",
        marginLeft: theme.spacing(5),
        marginRight: "auto",
        marginTop: theme.spacing(4)
    },
    checkboxContainer: {
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "16px"
    },
    serialBase: {
        marginLeft: "20px",
        marginBottom: "-10px"
    }
}));

const CreateAssetDialog = ({ open, setOpen, onSuccess, onSemiSuccess }) => {
    const classes = useStyles();

    const [options, setOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [chosenLocation, setChosenLocation] = useState(null);
    const [serials, setSerials] = useState("");
    const [schema, setSchema] = useState("");
    const [incorrect, setIncorrect] = useState([]);
    const [entryType, setEntryType] = useState("range");
    const [beginRange, setBeginRange] = useState("");
    const [endRange, setEndRange] = useState("");
    const [owner, setOwner] = useState("");
    const [serialEntered, setEntered] = useState(true);

    /* Error statuses */
    const [missingType, setMissingType] = useState(false);
    const [missingBegin, setMissingBegin] = useState(false);
    const [missingEnd, setMissingEnd] = useState(false);
    const [missingOwner, setMissingOwner] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);
    const [missingLocationOverride, setMissingLocationOverride] = useState(false); //checkbox state for creating an asset without an initial deployedLocation

    const [user,] = useLocalStorage('user', {});

    useEffect(() => {
        /* Fetch possible asset types */
        fetch(`${process.env.REACT_APP_API_URL}/assets/schemas`)
            .then(res => res.json())
            .then(json => setOptions(json));

        /* Fetch possible locations */
        fetch(`${process.env.REACT_APP_API_URL}/locations`)
            .then(res => res.status < 300 ? res.json() : null)
            .then(json => {
                if (json) setLocationOptions(json);
            });
    }, [])


    const handleSubmit = (event) => {
        event.preventDefault();

        /* Input validation */

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

        if (!chosenLocation && !missingLocationOverride) {
            setMissingLocation(true);
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
                if (chosenLocation) data.initialLocation = chosenLocation;
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
            if (chosenLocation) data.initialLocation = chosenLocation;
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
        setChosenLocation(null);
        setBeginRange("");
        setEndRange("");
        setIncorrect([]);
        setMissingBegin(false);
        setMissingEnd(false);
        setMissingType(false);
        setMissingLocation(false);
        setMissingLocationOverride(false);
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
        setChosenLocation(null);
        setMissingBegin(false);
        setMissingEnd(false);
        setMissingType(false);
        setMissingOwner(false);
        setMissingLocation(false);
        setMissingLocationOverride(false);
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
                            }}>
                            {options && (options.map((option, key) => <MenuItem key={key} value={option.name}>{option.name}</MenuItem>))}

                        </Select>
                    </FormControl>
                    <FormControl component="fieldset" className={classes.entry}>
                        <FormLabel component="legend">Method</FormLabel>
                        <RadioGroup row aria-label="method" name="method" value={entryType} onChange={handleEntryTypeChange}>
                            <FormControlLabel value="range" control={<Radio />} label="Range" />
                            <FormControlLabel value="list" control={<Radio />} label="List" />
                        </RadioGroup>
                    </FormControl>
                    {schema && (<Typography className={classes.serialBase}><b>Serial base: </b>{options?.filter(item => item.name === schema)?.[0]?.serializationFormat}</Typography>)}
                    <br />
                    {
                        entryType === "list"
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

                    <FormControl variant="outlined" className={classes.dropdown}>
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

                    {/* Location picker */}
                    <div className={classes.dropdown}>
                        <Autocomplete
                            id="initial-location-picker"
                            options={locationOptions}
                            getOptionLabel={(option) => `${option.locationName} (${option.key})`}
                            value={chosenLocation}
                            fullWidth
                            groupBy={(option) => option.locationType}
                            onChange={(event, newValue) => {
                                setChosenLocation(newValue);
                                setMissingLocation(false);
                                setMissingLocationOverride(false);
                            }}
                            error={(!missingLocationOverride && missingLocation)}
                            disabled={missingLocationOverride}
                            renderOption={(option) => {
                                return (
                                    <>
                                        <div>
                                            {option.locationName} {`(${option.key})`}
                                            <Typography className={classes.subtitle} variant="subtitle2">
                                                {
                                                    option.operator ?
                                                        option.operator
                                                        : option.client ?
                                                            option.client
                                                            : option.address ?
                                                                option.address
                                                                : null
                                                }
                                            </Typography>
                                        </div>
                                    </>
                                )
                            }}
                            renderInput={(params) => <TextField {...params} label="Initial Location" variant="outlined" error={missingLocation} />}
                        />
                    </div>
                </div>

                {/* Override missing location warning */}
                {
                    missingLocation && (
                        <div className={classes.checkboxContainer}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={missingLocationOverride}
                                            onChange={() => setMissingLocationOverride(ov => !ov)}
                                            name="locationOverride"
                                            color="primary"
                                        />
                                    }
                                    label="Create asset with no location set?"
                                />
                            </FormGroup>
                        </div>
                    )
                }

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

CreateAssetDialog.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    onSuccess: PropTypes.func,
    onSemiSuccess: PropTypes.func
};

export default CreateAssetDialog;