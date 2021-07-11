import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

//Library Tools
import { Map, Marker, TileLayer, FeatureGroup } from 'react-leaflet';

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

//Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import UndoIcon from '@material-ui/icons/Undo';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
        fontWeight: "bold"
    },
    accordion: {
        backgroundColor: "#EBEBEB"
    },
    accordianDetails: {
        backgroundColor: "#FAFAFA",
        display: "block",
        paddingRight: "5%"
    },
    icon: {
        fontSize: "18px"
    },
    editField: {
        paddingRight: "5px",
        '& input[type="text"]': {
            paddingTop: "1px",
            paddingBottom: "1px",
            fontSize: "16px",
            paddingRight: "5%",
            backgroundColor: "#FFFFFF"
        }
    },
    clearIcon: {
        color: "#B80002",
        fontSize: "18px"
    },
    customProperty: {
        "&:hover": {
            textDecoration: "underline",
            cursor: "pointer"
        }
    }
}));

const LocationAccordion = ({ expanded, submission, onExpand, location, overrides, name, title, onUndoOverride, onOverride }) => {
    const classes = useStyles();

    const [tempOverrides, setTempOverrides] = useState({});
    const [isEditingMap, toggleIsEditingMap] = useState(false);
    const [addingCustomProp, toggleAddingCustomProp] = useState(false);
    const [customProp, setCustomProp] = useState({ key: null, value: null });
    const [newPropError, setNewPropError] = useState(null);
    const [overrideMarker, setOverrideMarker] = useState(null);
    const [editing, setCurrentEditing] = useState(null);

    const handleValueChange = (event, name) => {
        const { value } = event.target;
        setTempOverrides(s => ({ ...s, [name]: value }))
    }

    const handleNewPropChange = (event, type) => {
        if (newPropError) setNewPropError(null);
        const { value } = event.target;
        if (type === "key") {
            setCustomProp(s => ({ ...s, key: value }));
        } else if (type === "value") {
            setCustomProp(s => ({ ...s, value: value }));
        }
    }

    const handleCustomPropCancel = () => {
        setCustomProp({ key: null, value: null });
        toggleAddingCustomProp(false);
        setNewPropError(null);
    }

    const handleCustomPropSave = () => {
        const propValues = Object.values(customProp);
        const originalKeys = Object.keys(location);
        if (propValues.includes(null) || propValues.includes("")) {
            setCustomProp({ key: null, value: null });
            toggleAddingCustomProp(false);
            return;
        } else if (originalKeys.includes(customProp["key"].toLowerCase())) {
            setCustomProp({ key: null, value: null });
            setNewPropError("ERROR: Disallowed key");
            return;
        } else {
            onOverride(customProp["key"], customProp["value"]);
            setCustomProp({ key: null, value: null });
            toggleAddingCustomProp(false);
            return;
        }
    }

    useEffect(() => {
        if (!expanded) {
            setCurrentEditing(null);
            setTempOverrides({});
            setCustomProp({ key: null, value: null });
            toggleAddingCustomProp(false);
            toggleIsEditingMap(false);
            setOverrideMarker(null);
            setNewPropError(null);
        }
    }, [expanded]);

    return (
        <Accordion className={classes.accordion} expanded={expanded} onChange={onExpand}>

            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${name}-content`} id={`${name}-header`}>
                <Typography className={classes.heading}>{title}</Typography>
                <Typography>{submission[name] ? submission[name].name : null}</Typography>
            </AccordionSummary>

            <AccordionDetails className={classes.accordianDetails}>
                {/* Render out all key-value pairs from the location document */}
                {
                    location ?
                        <>
                            {Object.entries(location).map(([key, val]) => {
                                /* Break up key camelCase and capitalize the first letter for a nice label */
                                const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

                                /* Exclude "key" and "locationName" values from being overridden by not showing edit button */
                                if (key === "key" || key === "locationName") {
                                    return (
                                        <div key={key}>
                                            <Grid container justify="space-between">
                                                <Grid item xs={6}>
                                                    <Typography><b>{capitalizedKey}:</b></Typography>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <Grid container>
                                                        <Grid item xs={11}>
                                                            <Typography>{val}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    );
                                } else if (key === "_id" || key === "__v") {
                                    return null;
                                } else if (key === "coordinates") {
                                    return (
                                        <div key={key}>
                                            <Grid container direction="row" justify="space-between">
                                                <Grid item xs={5}>
                                                    <Typography><b>{capitalizedKey}:</b></Typography>
                                                </Grid>
                                                <Grid item xs={1} />
                                                <Grid item xs={4}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography>{Object.keys(overrides).includes(key) ? JSON.stringify([overrides[key][1].toFixed(4), overrides[key][0].toFixed(4)]) : val.length ? JSON.stringify([val[1].toFixed(4), val[0].toFixed(4)]) : "None"}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                {
                                                    isEditingMap ?
                                                        <>
                                                            <Grid item xs={12} style={{ marginTop: "10px" }}>
                                                                <Map center={Object.keys(overrides).includes(key) ? [...overrides[key]].reverse() : val.length ? [...val].reverse() : [0,0]} zoom={val.length ? 10 : 5} onClick={(e) => setOverrideMarker([e.latlng["lat"], e.latlng["lng"]])} style={{ height: "95%" }}>
                                                                    <TileLayer
                                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                                    />
                                                                    <FeatureGroup>
                                                                        {
                                                                            (overrideMarker || overrides["coordinates"]) ?
                                                                                <Marker position={(overrideMarker || [...overrides[key]].reverse())} />
                                                                                : <Marker position={val.length ? [...val].reverse() : [0,0]} />
                                                                        }
                                                                    </FeatureGroup>
                                                                </Map>
                                                            </Grid>
                                                            <Grid item xs={12} style={{ textAlign: "center", marginTop: "5px" }}>
                                                                {
                                                                    overrideMarker ?
                                                                        <>
                                                                            <Button
                                                                                variant="outlined"
                                                                                color="secondary"
                                                                                onClick={() => {
                                                                                    overrides["coordinates"] = [...overrideMarker].reverse();

                                                                                    toggleIsEditingMap(false);
                                                                                    setOverrideMarker(null);
                                                                                }}
                                                                                startIcon={<SaveIcon />}>Save</Button>
                                                                            <Button
                                                                                variant="outlined"
                                                                                color="secondary"
                                                                                onClick={() => setOverrideMarker(null)}
                                                                                style={{ marginLeft: "5px" }}
                                                                                startIcon={<UndoIcon />}>Undo</Button>
                                                                            <Typography><b>New coordinates:</b> {JSON.stringify(overrideMarker)}</Typography>
                                                                        </>
                                                                        : <Button
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            onClick={() => toggleIsEditingMap(false)}
                                                                            startIcon={<ClearIcon />}>Cancel</Button>
                                                                }

                                                            </Grid>
                                                        </>
                                                        :
                                                        <>
                                                            {
                                                                Object.keys(overrides).includes(key) ?
                                                                    <Tooltip title={`Undo`} placement="top">
                                                                        <IconButton style={{ padding: "3px" }} onClick={() => onUndoOverride(key)}>
                                                                            <UndoIcon className={classes.icon} />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    : null
                                                            }
                                                            {
                                                                val.length || overrides[key] ? 
                                                                <Tooltip title={`View and Edit`} placement="top">
                                                                <IconButton style={{ padding: "3px", marginRight: "-6px" }} onClick={() => toggleIsEditingMap(true)}>
                                                                    <EditIcon className={classes.icon} />
                                                                </IconButton>
                                                            </Tooltip>
                                                                :
                                                                <Tooltip title={`Add Coordinates`} placement="top">
                                                                <IconButton style={{ padding: "3px", marginRight: "-6px" }} onClick={() => toggleIsEditingMap(true)}>
                                                                    <AddIcon className={classes.icon} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            }
                                                            
                                                        </>
                                                }
                                            </Grid>
                                        </div>
                                    );
                                } else {

                                    /* For all other keys, render them out with edit buttons to allow them to be overridden */
                                    return (
                                        <div key={key}>
                                            <Grid container justify="space-between">
                                                <Grid item xs={5}>
                                                    <Typography><b>{capitalizedKey}:</b></Typography>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <Grid container>
                                                        <Grid item xs={9}>
                                                            {
                                                                /* Render a textbox whose value is either the current edited value, the previously saved edited value or the original value (in that order depending on existence) 
                                                                 * when the current editing key is equal to this key.
                                                                 *
                                                                 * Otherwise, render either the overriden value if it exists or the value from the original location document.
                                                                 */
                                                            }
                                                            {
                                                                editing === key ?
                                                                    <>
                                                                        <TextField
                                                                            className={classes.editField}
                                                                            variant="outlined"
                                                                            value={tempOverrides[key]}
                                                                            onChange={(event) => handleValueChange(event, key)} />
                                                                    </>
                                                                    : <Typography>{Object.keys(overrides).includes(key) ? overrides[key] : val}</Typography>
                                                            }
                                                        </Grid>

                                                        <Grid item xs={2}>
                                                            {
                                                                /*
                                                                 * If the current editing key is equal to this key, then render a cancel button next to the newly rendered textbox.
                                                                 *
                                                                 * Otherwise, if the value has been edited (i.e. the key exists in "shipFromOverrides"), render an undo button that removes the override and thus reverts to the original value.
                                                                 */
                                                            }
                                                            {
                                                                editing === key ?

                                                                    <Tooltip title={`Cancel`} placement="top">
                                                                        <IconButton style={{ padding: "3px" }} onClick={() => {
                                                                            /* Remove the temporary edit value so the next time the editor is opened it doesn't display the unsaved edit */
                                                                            setTempOverrides(s => {
                                                                                delete s[key];
                                                                                return { ...s };
                                                                            });

                                                                            /* Set editing key to null to revert from textbox to plain text */
                                                                            setCurrentEditing(null);
                                                                        }}>
                                                                            <ClearIcon className={classes.clearIcon} />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    : Object.keys(overrides).includes(key) ?
                                                                        <Tooltip title={`Undo`} placement="top">
                                                                            <IconButton style={{ padding: "3px" }} onClick={() => {

                                                                                /* Remove overriden value */
                                                                                onUndoOverride(key);
                                                                                setTempOverrides(t => ({ ...t, [key]: location[key] }));
                                                                            }}>
                                                                                <UndoIcon className={classes.icon} />
                                                                            </IconButton>
                                                                        </Tooltip>

                                                                        : null
                                                            }
                                                        </Grid>

                                                        <Grid item xs={1}>
                                                            {
                                                                /*
                                                                 * If the current editing key is equal to this one, render a save button that stores the new entry in a temporary object 
                                                                 * for use in the textbox onChange which updates the main override object onClick.
                                                                 *
                                                                 * Otherwise, render an edit button that sets the current editing key to this one onClick.
                                                                 */
                                                            }
                                                            {
                                                                editing !== null ?

                                                                    editing === key ?

                                                                        <Tooltip title={`Save ${capitalizedKey}`} placement="right">
                                                                            <IconButton style={{ padding: "3px" }} onClick={() => {
                                                                                const tempVal = tempOverrides[key];
                                                                                setTempOverrides(t => {
                                                                                    delete t[key];
                                                                                    return { ...t };
                                                                                });
                                                                                onOverride(key, tempVal);
                                                                                setCurrentEditing(null); //turn off editing
                                                                            }}>
                                                                                <SaveIcon className={classes.icon} />
                                                                            </IconButton>
                                                                        </Tooltip>

                                                                        : null

                                                                    :

                                                                    <Tooltip title={`Override ${capitalizedKey}`} placement="right">
                                                                        <IconButton style={{ padding: "3px" }} onClick={() => setCurrentEditing(`${key}`)}>
                                                                            <EditIcon className={classes.icon} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    );
                                }
                            })
                            }
                            {
                                Object.keys(overrides).map((key) => {
                                    if (Object.keys(location).includes(key)) return null;
                                    const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                                    return (
                                        <Grid key={key} container justify="space-between">
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle1"><b>{capitalizedKey}:</b></Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography variant="subtitle1">{overrides[key]}</Typography>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Tooltip title={`Remove custom property "${key}"`} placement="top">


                                                    <IconButton style={{ padding: "3px" }} onClick={() => onUndoOverride(key)}>
                                                        <ClearIcon className={classes.clearIcon} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    )
                                })
                            }
                            {
                                addingCustomProp ?
                                    <Grid container justify="space-between" style={{ marginTop: "5px" }}>
                                        <Grid item xs={5}>
                                            <TextField
                                                className={classes.editField}
                                                variant="outlined"
                                                size="small"
                                                value={customProp.key}
                                                onChange={(event) => handleNewPropChange(event, "key")} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                className={classes.editField}
                                                variant="outlined"
                                                size="small"
                                                value={customProp.value}
                                                onChange={(event) => handleNewPropChange(event, "value")} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button onClick={handleCustomPropSave}>Save</Button>
                                            <Button onClick={handleCustomPropCancel}>Cancel</Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {newPropError ? <Typography variant="subtitle2" style={{ color: "red" }}><b>{newPropError}</b></Typography> : null}
                                        </Grid>
                                    </Grid>
                                    : !isEditingMap ? <Typography className={classes.customProperty} onClick={() => toggleAddingCustomProp(true)} variant="body2">(+) Add custom property</Typography> : null
                            }

                        </>
                        : null
                }
            </AccordionDetails>
        </Accordion>
    );
};

LocationAccordion.propTypes = {
    /**
     * Boolean that determines whether the accordion is expanded
     */
    expanded: PropTypes.bool.isRequired,
    /**
     * The shipment object to be submitted, passed in from shipment creator tool
     */
    submission: PropTypes.object.isRequired,
    /**
     * The location document from which to render the key-value pairs
     */
    location: PropTypes.object,
    /**
     * The object representing the saved key-value pair overrides for the particular location
     */
    overrides: PropTypes.object.isRequired,
    /**
     * Name of accordion for use in id and labelling attributes
     */
    name: PropTypes.string.isRequired,
    /**
     * Title string to display next to the accordion
     */
    title: PropTypes.string,
    /**
     * Function to run when accordion clicked to trigger expansion
     */
    onExpand: PropTypes.func.isRequired,
    /**
     * Function to run when "undo" button is clicked on an overridden property, removes the key-value pair from the saved overrides object
     * 
     * @param {string} key the key of the property to remove from the overrides object
     */
    onUndoOverride: PropTypes.func.isRequired,
    /**
     * Function to run when override is saved, updates the key-value pair in the overrides object, or adds it if not already present
     * 
     * @param {string} key the key to override
     * @param {any} value the new value associated with the key
     */
    onOverride: PropTypes.func.isRequired
}

export default LocationAccordion;