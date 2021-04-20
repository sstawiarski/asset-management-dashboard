import React, { useEffect, useState, Suspense } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import { makeStyles } from '@material-ui/core/styles';

//Material-UI Components
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

//Other Components
import PDFViewer from '../../General/PDFViewer'
const FileViewer = React.lazy(() => import('react-file-viewer'));

const useStyles = makeStyles(theme => ({
    downloadLinkContainer: {
        float: "right"
    },
    downloadLinkText: {
        fontSize: "1rem",
        textDecoration: "none",
        color: "#48656b",
        marginLeft: "20px",
        lineHeight: 1
    },
    dialogContent: {
        height: "100%"
    },
    fileViewer: {
        width: "100%"
    }
}));

const FilePreview = ({ file, open, onClose, title, prepend, onFailure }) => {
    const classes = useStyles();

    const [downloadURL, setDownloadURL] = useState("");

    useEffect(() => {
        if (file) {
            setDownloadURL(`${process.env.REACT_APP_API_URL}/attachments/${file.link}`);
        }
    }, [file]);

    //Retrieved from https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch
    //Fixes downloaded file naming when server is run on a different origin
    const handleDownloadClick = () => {
        fetch(downloadURL)
            .then(response => response.blob())
            .then(blob => {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = prepend ? `[${prepend}] ${file.filename}` : file.filename;
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();
                a.remove();  //afterwards we remove the element again         
            });
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth className={classes.fileViewerContainer}>
            <DialogTitle>
                <span>{title}</span>
                <div className={classes.downloadLinkContainer}>
                    <Button className={classes.downloadLinkText} variant="text" size="small" onClick={handleDownloadClick}>Download</Button>
                </div>
            </DialogTitle>

            <DialogContent className={classes.dialogContent}>
                {
                    file?.fileType === 'pdf' ?
                        <PDFViewer filepath={downloadURL} onError={onFailure} />
                        : file?.fileType && (
                            <Suspense fallback={null}>
                                <FileViewer
                                    className={classes.fileViewer}
                                    fileType={file ? file.fileType : "jpg"}
                                    filePath={downloadURL}
                                    onError={onFailure} />
                            </Suspense>
                        )

                }

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    )

};

FilePreview.propTypes = {
    /**
     * An Attachment object
     */
    file: PropTypes.object,
    /**
     * A Boolean determining whether or not the preview dialog is open
     */
    open: PropTypes.bool,
    /**
     * A String to use as the preview dialog title
     */
    title: PropTypes.string,
    /**
     * String to prepend to the downloaded file
     */
    prepend: PropTypes.string,
    /**
     * Handler function to run when the user closes the preview dialog
     */
    onClose: PropTypes.func,
    /**
     * Handler function to run if the file cannot be previewed
     */
    onFailure: PropTypes.func,
};

export default FilePreview;