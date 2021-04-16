import React, { useState } from "react";

//Library Tools
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";

//Material-UI Components
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

//Icons
import CloseIcon from "@material-ui/icons/Close";
import { IconButton, Typography } from "@material-ui/core";

//Utils
import { formatBytes } from "../../utils/math.utils";

const uuid = require("react-uuid");

const useStyles = makeStyles((theme) => ({
    dropzone: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        borderWidth: "2px",
        borderRadius: "2px",
        borderColor: "#C8D0D9",
        borderStyle: "dashed",
        backgroundColor: "#FAFAFA",
        color: "#BDBDBD",
        outline: "none",
        transition: "border .10s ease-in-out",
        "&:hover": {
            borderColor: theme.palette.secondary.main,
        },
    },
    fileListHeader: {
        fontWeight: "bold",
        marginTop: "15px",
    },
    deleteIcon: {
        color: "red",
        fontSize: "0.9rem",
    },
    noFiles: {
        textAlign: "center",
    },
    clickFile: {
        "&:hover": {
            cursor: "pointer",
        },
    },
    deleteButton: {
        padding: "0.3rem",
        marginLeft: "5px",
    },
}));

type AttachmentDropperProps = {
    /**
     * An array of files to be attached; either a FileList or a plain Array of Files
     */
    files: FileList | File[];
    /**
     * Handler function that is called when files are selected
     *
     * @param files array of Files to be uploaded
     */
    onDrop: (files: File[]) => void;
    /**
     * Handler function that is called when the "Delete" button is clicked for a particular file
     *
     * @param index the index of the number in the file array that is to be deleted
     */
    onFileDelete: (index: number) => void;
};

type FileTooBigProps = {
    /** Opens an error alert when files are too large to be uploaded */
    openAlert: boolean;
    /** Custom message to display on the error alert */
    message: string;
};

const AttachmentDropper: React.FC<AttachmentDropperProps> = ({ files, onDrop, onFileDelete }) => {
    const [fileTooBig, setFileTooBig] = useState<FileTooBigProps>({
        openAlert: false,
        message: "",
    });

    const validateFileSize = (acceptedFiles: File[]) => {
        let filesTooBig: File[] = [];
        const onlyValidFiles: File[] = acceptedFiles.reduce((acc, c) => {
            if (c.size <= 15728640) {
                acc.push(c);
            } else {
                filesTooBig.push(c);
            }

            return acc;
        }, [] as File[]);

        if (filesTooBig.length > 0) {
            setFileTooBig({
                openAlert: true,
                message: `${filesTooBig.length} files were larger than 15MiB and were not added!`,
            });
        }

        onDrop(onlyValidFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: validateFileSize,
    });

    const classes = useStyles();

    return (
        <section>
            <div {...getRootProps()} className={classes.dropzone}>
                <input {...getInputProps()} />
                <p className={classes.clickFile}>Drag and drop attachments here, or click to select files to attach</p>
                <Typography variant="subtitle2">Max file size: 15MiB</Typography>
            </div>
            <aside>
                <Typography className={classes.fileListHeader} variant="body1">
                    Files
                </Typography>

                {files && files.length ? (
                    <ul>
                        {Array.from(files).map((file, idx) => {
                            const id = uuid();
                            return (
                                <li key={id}>
                                    <div style={{ display: "block" }}>
                                        <Typography variant="body2" display="inline">
                                            {file.name} ({formatBytes(file.size, 2)})
                                        </Typography>
                                        <IconButton
                                            className={classes.deleteButton}
                                            onClick={() => onFileDelete(idx)}
                                            disableRipple>
                                            <CloseIcon className={classes.deleteIcon} />
                                        </IconButton>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <Typography className={classes.noFiles} variant="body2">
                        No files added
                    </Typography>
                )}
            </aside>

            {/* Display error when file is too large */}
            <Snackbar
                open={fileTooBig.openAlert}
                autoHideDuration={3000}
                onClose={() => setFileTooBig({ openAlert: false, message: "" })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={() => setFileTooBig({ openAlert: false, message: "" })} severity="error" elevation={3}>
                    {fileTooBig.message}
                </Alert>
            </Snackbar>
        </section>
    );
};

export default AttachmentDropper;
