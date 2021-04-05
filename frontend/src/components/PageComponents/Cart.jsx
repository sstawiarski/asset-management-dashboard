import React, { useState } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Components
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

//Icons
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    popper: {
        background: "#FFFFFF",
        boxShadow: "2px 3px 7px 0px rgba(0, 0, 0, 0.3)",
        borderRadius: "7px",
        width: "417px",
        height: "fit-content",
        maxHeight: "75vh",
        overflow: "scroll",
        margin: "40px"
    },
    cartContent: {
        padding: "20px 20px 50px 20px"
    },
    cellWithOverflow: {
        display: "block",
        maxWidth: "100px",
        overflowX: "scroll",
        marginBottom: "0px"
    },
    headers: {
        paddingTop: "20px"
    },
    divider: {
        marginTop: "15px"
    },
    remove: {
        color: theme.palette.secondary.main
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px"
    },
    items: {
        borderBottom: "none"
    },
    cancelNotes: {
        color: "#CF000E",
        float: "left",
        "&:hover": {
            textDecoration: "underline",
            cursor: "pointer"
        }
    },
    submitNotes: {
        color: "#5DB4E0",
        float: "right",
        "&:hover": {
            textDecoration: "underline",
            cursor: "pointer"
        }
    },
    subRow: {
        paddingTop: "0px"
    },
    clearButton: {
        borderColor: "#D10000",
        color: "#D10000"
    }
}));

const NewCart = ({ title = "Cart", anchorEl, cartItems, headers, notes = false, onRemove, onClickAway, onSubmit, onNoteUpdate, onClear, placement }) => {
    const classes = useStyles();

    const [editObj, setEditObj] = useState(null); //the current object whose notes are being edited
    const [editingNotes, setNotes] = useState(""); //current editing note text


    const handleCancel = () => {
        setEditObj(null);
        setNotes("")
    };

    /* Provides id key to parent (i.e. the key that identifies an item (serial or UUID)) and the new notes */
    const handleSubmit = (idKey, identifier) => {
        const noteUpdateObj = {
            idKey: idKey,
            [idKey]: identifier,
            notes: editingNotes
        }

        onNoteUpdate(noteUpdateObj);
        setEditObj(null);
        setNotes("");
    };

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    const handleEditExisting = (id, existingNotes) => {
        setNotes(existingNotes);
        setEditObj(id);
    }

    return (
        <Popper
            className={classes.popper}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            transition
            placement={placement ? placement : "bottom"}>
            {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={onClickAway}>
                    <Fade {...TransitionProps}>
                        <Grid container direction="column" justify="space-between">
                            <Grid item xs={12} className={classes.cartContent}>
                                <Typography variant="h6"><b>{title}</b></Typography>
                                <Table style={{ width: "100%" }}>

                                    <TableHead>
                                        <TableRow>
                                            {[...headers, ""].map(item => <TableCell key={item}><b>{item}</b></TableCell>)}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            cartItems.map((item, idx) => {
                                                //determine proper identifier to display and send to parent on edit
                                                const identifier = item.serial !== "N/A" ? item.serial : item.uuid;
                                                const idPropName = item.serial !== "N/A" ? "serial" : "uuid";
                                                const idObj = {
                                                    [idPropName]: identifier
                                                };

                                                //determine whether a specific quantity exists for the item, used later to display 1 if not
                                                const hasQuantity = Object.keys(item).includes("quantity");

                                                return (
                                                    <React.Fragment key={item.serial !== "N/A" ? item.serial : idx}>
                                                        <TableRow>
                                                            {
                                                                Object.entries(item).map(([key, val]) => {
                                                                    //ignore irrelevant keys
                                                                    if (key === "uuid" || key === "quantity" || key === "notes") return null;

                                                                    //return value in container that scrolls if the text is too long
                                                                    return (
                                                                        <TableCell className={notes ? classes.items : null} key={val}>
                                                                            <div className={classes.cellWithOverflow}>{val}</div>
                                                                        </TableCell>
                                                                    )
                                                                }
                                                                )
                                                            }

                                                            {/* Display quantity or "1" */}
                                                            {
                                                                headers.includes("Quantity") ?
                                                                    hasQuantity ?
                                                                        <TableCell className={notes ? classes.items : null}>{item.quantity}</TableCell>
                                                                        : <TableCell className={notes ? classes.items : null}>1</TableCell>
                                                                    : null
                                                            }

                                                            {/* Remove from cart button */}
                                                            <TableCell className={notes ? classes.items : null}>
                                                                <Tooltip title={`Remove ${item.serial !== "N/A" ? item.serial : item.name}`} placement="right">
                                                                    <IconButton onClick={() => onRemove(idObj)}>
                                                                        <DeleteIcon className={classes.remove} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>

                                                        </TableRow>

                                                        {/* Display notes editor if "notes" prop is true, otherwise nothing */}
                                                        {/* Then check whether the current editing object is the current row and display the editor as needed */}
                                                        {
                                                            notes ?
                                                                identifier === editObj ?
                                                                    <TableRow>
                                                                        <TableCell colSpan={headers.length + 1} className={classes.subRow}>
                                                                            <TextField value={editingNotes} fullWidth variant="outlined" onChange={handleNotesChange} />
                                                                            <br />
                                                                            <div style={{ display: "block" }}>
                                                                                <Typography variant="body2" className={classes.cancelNotes} onClick={handleCancel}>Cancel</Typography>
                                                                                <Typography variant="body2" className={classes.submitNotes} onClick={() => handleSubmit(idPropName, identifier)}>Submit</Typography>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    : item.notes ?
                                                                        <TableRow>
                                                                            <TableCell className={classes.subRow} colSpan={headers.length + 1}>
                                                                                <Typography variant="body2"><b>Notes</b></Typography>
                                                                                <Typography variant="body2" className={classes.submitNotes} onClick={() => handleEditExisting(identifier, item.notes)}>Edit</Typography>

                                                                                <Typography variant="body2">{item.notes}</Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        : <TableRow>
                                                                            <TableCell className={classes.subRow} colSpan={headers.length + 1}><Typography className={classes.submitNotes} variant="subtitle2" onClick={() => setEditObj(identifier)}>Add Notes</Typography></TableCell>
                                                                        </TableRow>
                                                                : null
                                                        }
                                                    </React.Fragment>
                                                );
                                            }
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </Grid>

                            {/* Clear cart and submit button container */}
                            <div className={classes.buttonContainer}>
                                <Button className={classes.clearButton} onClick={onClear} variant="outlined">Clear Cart</Button>
                                <Button onClick={onSubmit} variant="contained" color="primary">Submit</Button>
                            </div>

                        </Grid>
                    </Fade>
                </ClickAwayListener>
            )}

        </Popper>
    )
};

NewCart.propTypes = {
    /**
     * Title of the cart, defaults to "Cart"
     */
    title: PropTypes.string,
    /**
     * DOM anchor element to render the cart popup at
     */
    anchorEl: PropTypes.instanceOf(Element),
    /**
     * Function to run when user clicks off of the popup
     */
    onClickAway: PropTypes.func.isRequired,
    /**
     * Array of item objects in the cart
     * 
     * Expects items have a name and a unique serial, failing that, a serial equal to "N/A" and a unique ID property called 'uuid' (for unserialized items)
     */
    cartItems: PropTypes.array.isRequired,
    /**
     * Function to call when an item is removed from the cart, takes in object with the proper key, "serial" or "uuid", and its value to identify the proper item to remove
     */
    onRemove: PropTypes.func.isRequired,
    /**
     * Headers for the cart table
     */
    headers: PropTypes.array.isRequired,
    /**
     * Submit handler
     */
    onSubmit: PropTypes.func.isRequired,
    /**
     * Notes added to cart item handler
     * 
     * Argument is an object with the following schema:
     * ```
     * {
     *      idKey: `the name of the key that identifies an object, either "serial" or "uuid" in most cases`,
     *      [idKey]: `the identifying value, placed under the actual key identified in idKey`,
     *      notes: `the new notes to add, onNoteUpdate should remove the notes if the notes passed is an empty string`
     * }
     * ```
     */
    onNoteUpdate: PropTypes.func,
    /**
     * Handler for removing all items from the cart
     */
    onClear: PropTypes.func.isRequired,
    /**
     * Whether or not notes can be added to items in the cart (for shipments)
     * Also determines where table row borders are added
     */
    notes: PropTypes.bool
}

export default NewCart;