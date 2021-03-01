import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import AddUnserializedDialog from '../components/Dialogs/AddUnserializedDialog';

import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    popper: {
        background: "#FFFFFF",
        boxShadow: "2px 3px 7px 0px rgba(0, 0, 0, 0.3)",
        borderRadius: "23px",
        width: "417px",
        height: "838px",
        overflow: "scroll"
    },
    cartContent: {
        padding: "20px 20px 50px 20px"
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
    submitArea: {
        background: "#FFFFFF",
        alignSelf: "flex-end",
        paddingRight: "20px",
        marginBottom: "20px"
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
    }
}));

const NewCart = ({ title = "Cart", anchorEl, cartItems, headers, notes = false, onRemove, onClickAway, onSubmit, onNoteUpdate, onUnserializedAdd }) => {
    const classes = useStyles();

    const [editObj, setEditObj] = useState(null);
    const [editingNotes, setNotes] = useState("");
    const [open, setOpen] = useState(false);

    const handleCancel = () => {
        setEditObj(null);
        setNotes("")
    };

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
        <>
            <Popper
                className={classes.popper}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                transition>
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={onClickAway}>
                        <Fade {...TransitionProps}>
                            <Grid container direction="column" justify="space-between">


                                <Grid item xs={12} className={classes.cartContent}>

                                    <div style={{ display: "block" }}>
                                        <Typography variant="h5" style={{ float: "left" }}><b>{title}</b></Typography>
                                        <Tooltip title="Add Unserialized Item" placement="top">
                                            <IconButton style={{ float: "right" }} onClick={() => setOpen(true)}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>



                                    <Table style={{ width: "100%" }}>
                                        <TableHead>
                                            <TableRow>
                                                {[...headers, ""].map(item => <TableCell key={item}><b>{item}</b></TableCell>)}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                cartItems.map((item, idx) => {
                                                    const identifier = item.serial !== "N/A" ? item.serial : item.uuid;
                                                    const idPropName = item.serial !== "N/A" ? "serial" : "uuid";
                                                    const idObj = {
                                                        [idPropName]: identifier
                                                    };

                                                    const hasQuantity = Object.keys(item).includes("quantity");

                                                    return (
                                                        <>
                                                            <TableRow key={item.serial !== "N/A" ? item.serial : idx}>
                                                                {
                                                                    Object.entries(item).map(([key, val]) => {
                                                                        if (key === "uuid" || key === "quantity" || key === "notes") return null;
                                                                        return (<TableCell className={classes.items} key={val}>
                                                                            <div style={{ display: "block", maxWidth: "100px", overflowX: "scroll", marginBottom: "0px" }}>
                                                                                {val}
                                                                            </div>

                                                                        </TableCell>)
                                                                    }
                                                                    )
                                                                }
                                                                {
                                                                    headers.includes("Quantity") ?
                                                                        hasQuantity ?
                                                                            <TableCell className={classes.items}>{item.quantity}</TableCell>
                                                                            : <TableCell className={classes.items}>1</TableCell>
                                                                        : null
                                                                }
                                                                <TableCell className={classes.items}>
                                                                    <Tooltip title={`Remove ${item.serial !== "N/A" ? item.serial : item.name}`} placement="right">
                                                                        <IconButton onClick={() => onRemove(idObj)}>
                                                                            <DeleteIcon className={classes.remove} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </TableCell>
                                                            </TableRow>
                                                            {
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
                                                                                <Typography variant="body2">
                                                                                    <b>Notes</b>
                                                                                    <Typography variant="body2" className={classes.submitNotes} onClick={() => handleEditExisting(identifier, item.notes)}>Edit</Typography>
                                                                                </Typography>
                                                                                <Typography variant="body2">{item.notes}</Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        : <TableRow>
                                                                            <TableCell className={classes.subRow} colSpan={headers.length + 1}><Typography className={classes.submitNotes} variant="subtitle2" onClick={() => setEditObj(identifier)}>Add Notes</Typography></TableCell>
                                                                        </TableRow>
                                                            }


                                                        </>
                                                    );
                                                }
                                                )
                                            }
                                        </TableBody>

                                    </Table>
                                </Grid>
                                <Grid item xs={12} className={classes.submitArea}>
                                    <Button onClick={onSubmit} variant="contained" color="primary">Submit</Button>
                                </Grid>
                            </Grid>
                        </Fade>
                    </ClickAwayListener>
                )}

            </Popper>
            <AddUnserializedDialog open={open} onClose={() => setOpen(false)} onSubmit={(item) => { onUnserializedAdd(item); setOpen(false); }} />
        </>
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
    anchorEl: PropTypes.instanceOf(Element).isRequired,
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
     * Allow notes to be added to items in the cart (for shipments)
     */
    notes: PropTypes.bool
}

export default NewCart;