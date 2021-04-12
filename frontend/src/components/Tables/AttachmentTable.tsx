import React, { useState } from "react";

//Library Tools
import { makeStyles } from "@material-ui/core/styles";

//Material-UI Imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";

import { Attachment, AlertInfo } from "../../types";

const useStyles = makeStyles({
    container: {
        maxHeight: "300px",
        overflowY: "scroll",
    },
    table: {
        width: "100%",
    },
    head: {
        backgroundColor: "#D9D9D9",
    },
    evenRow: {
        backgroundColor: "#FDFDFD",
    },
    oddRow: {
        backgroundColor: "#F4F4F4",
    },
    viewLink: {
        color: "#2392EB",
        "&:hover": {
            cursor: "pointer",
            textDecoration: "underline",
        },
    },
    deleteLink: {
        color: "#C50F00",
        "&:hover": {
            cursor: "pointer",
            textDecoration: "underline",
        },
    },
    deleteLinkDisabled: {
        color: "#C50F00",
        "&:hover": {
            cursor: "not-allowed",
        },
    },
    lastRow: {
        textAlign: "center",
    },
    dateText: {
        color: "grey",
    },
    notFoundText: {
        textAlign: "center",
    },
    addAttachmentButton: {
        lineHeight: 1,
    },
    deleteProgress: {
        color: "#C50F00",
    },
});

type AttachmentTableProps = {
    /**
     * An array of Attachment objects
     */
    attachments: Attachment[];
    /**
     * Boolean to determine whether or not to display loading placeholders
     */
    isLoading: boolean;
    /**
     * Handler function that is called when the user selects to add a new attachment
     */
    onAddClick: () => void;
    /**
     * Handler function that is called when the user clicks the delete button
     * Uses the item's UUID to call the proper DELETE endpoint
     *
     * @param item an Attachment object
     */
    onDeleteClick: (item: Attachment) => Promise<Response>;
    /**
     * Handler function that is called when the server responds to the DELETE request done in onDeleteClick
     *
     * @param alert an alert info object
     */
    onDelete: (alert: AlertInfo) => void;
    /**
     * Handler function that is called when the user clicks the "View" button in order to view the file preview
     *
     * @param item the Attachment object to view
     */
    onViewClick: (item: Attachment) => void;
};

const AttachmentTable: React.FC<AttachmentTableProps> = ({
    attachments,
    isLoading,
    onAddClick,
    onDeleteClick,
    onDelete,
    onViewClick,
}) => {
    const classes = useStyles();

    /* Delete attachment loading spinner state */
    const [deleteWait, setDeleteWait] = useState<Attachment | null>(null);

    /**
     * Handler function for "Delete" button
     *
     * @param row an Attachment object
     */
    const handleDelete = (row: Attachment): void => {
        setDeleteWait(row); //trigger delete spinner
        onDeleteClick(row).then((res) => {
            setDeleteWait(null); //stop the delete spinner
            /* Send appropriate response alerts to the parent component using the onDelete function from props */
            if (res.status === 200) {
                onDelete({
                    type: "success",
                    message: `Successfully deleted ${row.filename}!`,
                });
            } else {
                onDelete({
                    type: "error",
                    message: `Could not delete ${row.filename}...`,
                });
            }
        });
    };

    return (
        <TableContainer component={Paper} className={classes.container}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                {/* Headers -- some empty for holding "View" and "Delete" buttons */}
                <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="right">Filename</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Added By</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {isLoading
                        ? [1, 2, 3, 4, 5].map((val, idx) => (
                              <TableRow key={idx}>
                                  <TableCell colSpan={5}>
                                      <Skeleton />
                                  </TableCell>
                              </TableRow>
                          ))
                        : null}

                    {attachments && attachments.length && !isLoading ? (
                        attachments.map((row, idx) => (
                            <TableRow key={row.uuid} className={idx % 2 === 0 ? classes.evenRow : classes.oddRow}>
                                <TableCell component="th" scope="row">
                                    {idx + 1}
                                </TableCell>
                                <TableCell align="right" title={`UUID: ${row.uuid}`}>
                                    {row.filename}
                                </TableCell>
                                <TableCell onClick={() => onViewClick(row)}>
                                    <span className={classes.viewLink}>View</span>
                                </TableCell>

                                {/* Attachment added by user cell, renders date and time added below user name if it exists */}
                                <TableCell>
                                    {row.user}
                                    {row.dateAdded ? (
                                        <>
                                            <br />
                                            <Typography variant="subtitle2" className={classes.dateText}>
                                                {new Date(row.dateAdded).toLocaleString("en-US")}
                                            </Typography>
                                        </>
                                    ) : null}
                                </TableCell>

                                {/* "Delete" button or delete progress spinner if a delete is in progress -- clicks disabled on other rows if delete is still in progress */}
                                <TableCell>
                                    {deleteWait && deleteWait.link === row.link ? (
                                        <CircularProgress className={classes.deleteProgress} />
                                    ) : (
                                        <Typography
                                            className={deleteWait ? classes.deleteLinkDisabled : classes.deleteLink}
                                            variant="subtitle2"
                                            onClick={() => (deleteWait ? null : handleDelete(row))}>
                                            Delete
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : !isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className={classes.notFoundText}>
                                No attachments found
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {/* "Add Attachment" button in the last row, triggers onAddClick function from props */}
                    <TableRow>
                        <TableCell className={classes.lastRow} onClick={onAddClick} colSpan={5}>
                            <Button variant="text" size="small" color="primary" className={classes.addAttachmentButton}>
                                Add Attachment
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AttachmentTable;
