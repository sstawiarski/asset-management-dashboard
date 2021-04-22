import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

//Library tools
import { makeStyles } from "@material-ui/core/styles";

//Material-UI Imports
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";
import Snackbar from "@material-ui/core/Snackbar";
import Alert, { AlertProps } from "@material-ui/lab/Alert";

//Icons
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

//Custom Components
import Header from "../../components/General/Header";
import SimpleList from "../../components/Tables/SimpleList";
import SimpleMap from "../../components/General/Map";
import AttachmentTable from "../../components/Tables/AttachmentTable";
import FilePreview from "../../components/Dialogs/GeneralDialogs/FilePreview";
import UploadFileDialog from "../../components/Dialogs/GeneralDialogs/UploadFileDialog";

//Tools
import { dateOptions } from "../../utils/constants.utils";
import useLocalStorage from "../../utils/auth/useLocalStorage.hook";
import { downloadAsZip } from "../../utils/downloads.utils";

//Types
import { Attachment, AlertInfo, Manifest, Shipment } from "../../types";

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "10px",
    },
    paper: {
        width: "100%",
        paddingBottom: "75px",
    },
    item: {
        padding: "10px",
    },
    center: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "50%",
    },
    break: {
        flexGrow: 1,
        fontWeight: "bold",
    },
    button: {
        display: "block",
    },
    error: {
        color: "red",
    },
    errorIcon: {
        position: "relative",
        color: "red",
        fontSize: "14px",
        top: "3px",
        paddingRight: "3px",
    },
    errorDiv: {
        display: "inline-block",
    },
    puzzle: {
        position: "relative",
        top: "3px",
        paddingRight: "3px",
        color: "#E5C92D",
        fontSize: "14px",
    },
    puzzleText: {
        color: "#E5C92D",
    },
}));

const ShipmentDetails = () => {
    const classes = useStyles();

    /* Routing params and history */
    const { key } = useParams() as { key: string };
    const history = useHistory();

    /* Logged in user for assigning name to uploaded attachments */
    const [user] = useLocalStorage("user", {});

    const [shipment, setShipment] = useState<Shipment>({
        key: "",
        createdBy: "",
        created: "",
        status: "",
        shipmentType: "",
        shipFrom: {},
        shipTo: {},
        manifest: [],
    });
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasLocations, setHasLocations] = useState<boolean>(false);
    const [attach, setAttach] = useState<Attachment[]>([]);
    const [attachmentsLoading, setAttachmentsLoading] = useState<boolean>(true);
    const [viewFile, setViewFile] = useState<Attachment | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [addAttachment, setAddAttachment] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertInfo, setAlertInfo] = useState<AlertInfo>({
        type: "",
        message: "",
    });

    /* Fetch shipment information */
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/shipments/${key}`)
            .then((response) => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then((json) => {
                if (json) {
                    setShipment({
                        ...json,
                        manifest: json.manifest.map((item: Manifest) => {
                            const vals = Object.values(item);
                            vals.shift();
                            return vals;
                        }),
                    });
                    const head = Object.keys(json.manifest[0]);
                    try {
                        if (json.shipTo["coordinates"].length > 0 && json.shipFrom["coordinates"].length > 0) {
                            setHasLocations(true);
                        }
                    } catch {
                        setHasLocations(false);
                    }
                    head.shift();
                    setHeaders(head);
                    setLoading(false);
                }
            });

        fetch(`${process.env.REACT_APP_API_URL}/attachments/shipment/${key}`)
            .then((res) => res.json())
            .then((json) => {
                setAttach(json["attachments"] as Attachment[]);
            })
            .finally(() => setAttachmentsLoading(false));
    }, [key]);

    const fetchNewAttachments = () => {
        fetch(`${process.env.REACT_APP_API_URL}/attachments/shipment/${key}`)
            .then((res) => res.json())
            .then((json) => setAttach(json["attachments"] as Attachment[]));
    };

    /**
     * Attachment upload handler for use in UploadFileDialog
     */
    const handleAttachmentUpload = () => {
        const formData = new FormData();

        /* Add files to form data */
        for (const file of files) {
            formData.append("attachment", file);
        }

        /* Supply user's full name to attach to the upload */
        formData.append("name", user.firstName + " " + user.lastName);

        /* Upload files and display appropriate success/failure alert */
        fetch(`${process.env.REACT_APP_API_URL}/attachments/shipment/${key}`, {
            method: "POST",
            body: formData,
        }).then((res) => {
            if (res.status === 200) {
                setAddAttachment(false);
                setFiles([]);
                setAlertInfo({
                    type: "success",
                    message: "Successfully uploaded new attachment!",
                });
                setAlertOpen(true);
                fetchNewAttachments();
            } else {
                setAlertInfo({
                    type: "error",
                    message: "Could not upload attachment...",
                });
                setAlertOpen(true);
            }
        });
    };

    return (
        <div className={classes.root}>
            <Header heading="Shipments" />

            <Grid container>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item>
                            <Button className={classes.button} onClick={() => history.goBack()}>
                                <ArrowBackIosIcon fontSize="inherit" />
                                <span style={{ position: "relative", top: "-2px" }}>Back</span>
                            </Button>
                            <Paper className={classes.paper}>
                                <Typography className={classes.item} variant="h6">
                                    Shipment Details
                                </Typography>
                                <Divider />
                                <Grid container>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Key
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <Typography variant="body1">{key}</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Type
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <Typography variant="body1">{shipment.shipmentType}</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Status
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <Typography variant="body1">{shipment.status}</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Created By
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <Typography variant="body1">{shipment.createdBy}</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Ship From
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <Typography variant="body1">{shipment.shipFrom?.locationName}</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Ship To
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <Typography variant="body1">{shipment.shipTo?.locationName}</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Date Created
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <Typography variant="body1">
                                                {new Date(shipment.created).toLocaleDateString(
                                                    "en-US",
                                                    dateOptions as Intl.DateTimeFormatOptions
                                                )}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Contract ID
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <Typography variant="body1">{shipment.contractId}</Typography>
                                        )}
                                    </Grid>

                                    {shipment && !loading ? (
                                        shipment.updated ? (
                                            <Grid item xs={3} className={classes.item}>
                                                <Typography variant="subtitle1" className={classes.break}>
                                                    Last Updated
                                                </Typography>
                                                <Typography variant="body1">
                                                    {new Date(shipment.updated).toLocaleDateString(
                                                        "en-US",
                                                        dateOptions as Intl.DateTimeFormatOptions
                                                    )}
                                                </Typography>
                                            </Grid>
                                        ) : null
                                    ) : null}
                                </Grid>

                                <Grid container className={classes.item}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={hasLocations ? 6 : !shipment ? 6 : 12}
                                        className={classes.item}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Shipment Manifest
                                        </Typography>
                                        {/* List of child components */}
                                        {loading ? (
                                            <Skeleton variant="rect" height={300} style={{ borderRadius: "6px" }} />
                                        ) : (
                                            <SimpleList
                                                label="shipment manifest"
                                                data={shipment.manifest}
                                                headers={headers.map((key) => {
                                                    const regex = /(\b[a-z](?!\s))/g;
                                                    const newString = key.replace(regex, (str) => str.toUpperCase());
                                                    return newString === "Serialized" ? null : newString;
                                                })}
                                                link="/assets/"
                                            />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} className={classes.item}>
                                        {hasLocations || loading ? (
                                            <Typography variant="subtitle1" className={classes.break}>
                                                Route
                                            </Typography>
                                        ) : null}
                                        {/* Map */}
                                        {loading ? (
                                            <Skeleton variant="rect" height={300} style={{ borderRadius: "6px" }} />
                                        ) : hasLocations ? (
                                            <>
                                                <SimpleMap start={shipment.shipFrom} end={shipment.shipTo} />
                                            </>
                                        ) : null}
                                    </Grid>
                                </Grid>

                                {/* Attachments table */}
                                <Grid container style={{ marginTop: "calc(5vh + 50px)" }} justify="space-around">
                                    <Grid item xs={10}>
                                        <Typography variant="subtitle1" className={classes.break}>
                                            Attachments
                                        </Typography>
                                        
                                        {attach.length > 0 && (
                                            <Button
                                                style={{
                                                    float: "right",
                                                    marginTop: "-30px",
                                                }}
                                                size="small"
                                                color="secondary"
                                                onClick={() =>
                                                    downloadAsZip(attach, `[${key}] Attachments`).then((result) => {
                                                        if (result) {
                                                            setAlertInfo({
                                                                type: "success",
                                                                message: "Successfully downloaded attachments",
                                                            });
                                                            setAlertOpen(true);
                                                        } else {
                                                            setAlertInfo({
                                                                type: "error",
                                                                message: "Could not generate zip file!",
                                                            });
                                                            setAlertOpen(true);
                                                        }
                                                    })
                                                }>
                                                Download All
                                            </Button>
                                        )}

                                        <AttachmentTable
                                            attachments={attach}
                                            isLoading={attachmentsLoading}
                                            onViewClick={(item) => setViewFile(item)}
                                            onAddClick={() => setAddAttachment(true)}
                                            onDeleteClick={(item) =>
                                                fetch(`${process.env.REACT_APP_API_URL}/attachments/${item.uuid}`, {
                                                    method: "DELETE",
                                                })
                                            }
                                            onDelete={(alert) => {
                                                setAlertInfo(alert);
                                                setAlertOpen(true);
                                                if (alert["type"] === "success") fetchNewAttachments();
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* File preview dialog */}
            <FilePreview
                open={Boolean(viewFile)}
                file={viewFile}
                onClose={() => setViewFile(null)}
                title={viewFile ? `Previewing ${viewFile["filename"]}` : null}
                prepend={key}
                onFailure={() => {
                    setViewFile(null);
                    setAlertInfo({ message: "Could not preview file...", type: "error" });
                    setAlertOpen(true);
                }}
            />

            {/* Attachment upload dialog */}
            <UploadFileDialog
                open={addAttachment}
                files={files}
                onClose={() => {
                    setAddAttachment(false);
                    setFiles([]);
                }}
                onDrop={(items) => setFiles((f) => [...f, ...items])}
                onFileDelete={(index) =>
                    setFiles((f) => {
                        const newFiles = Array.from(f).filter((val, idx) => idx !== index);
                        return newFiles;
                    })
                }
                onUpload={handleAttachmentUpload}
            />

            {/* Alert snackbar for upload or delete response display */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
                onClose={() => {
                    setAlertInfo({ message: "", type: "" });
                    setAlertOpen(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert
                    elevation={3}
                    onClose={() => {
                        setAlertInfo({ message: "", type: "" });
                        setAlertOpen(false);
                    }}
                    severity={alertInfo["type"] as AlertProps["severity"]}>
                    {alertInfo["message"]}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ShipmentDetails;
