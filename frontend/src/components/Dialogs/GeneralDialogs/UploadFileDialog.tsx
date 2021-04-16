import React from "react";

//Library Tools
import { makeStyles } from "@material-ui/core/styles";

//Material-UI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";

//Custom Components
import AttachmentDropper from "../../General/AttachmentDropper";

const useStyles = makeStyles({
  warning: {
    fontSize: "100px",
    color: "#E5C92D",
  },
  confirm: {
    marginTop: "40px",
  },
  header: {
    backgroundColor: "#EBEBEB",
  },
  body: {
    backgroundColor: "#FAFAFA",
    textDecoration: "none",
  },
  container: {
    marginTop: "20px",
  },
  table: {
    minWidth: "300px",
    flexGrow: 1,
  },
  root: {
    padding: "0px 25px 0px 25px",
  },
});

type UploadFileDialogProps = {
  /** Determines whether the dialog is open */
  open: boolean;
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
   * Function to run when the dialog is closed
   */
  onClose: () => void;
  /**
   * Handler function for uploading the files
   */
  onUpload: () => void;
  /**
   * Handler function that is called when the "Delete" button is clicked for a particular file
   *
   * @param index the index of the number in the file array that is to be deleted
   */
  onFileDelete: (index: number) => void;
};

const UploadFileDialog: React.FC<UploadFileDialogProps> = ({
  open,
  files,
  onDrop,
  onClose,
  onUpload,
  onFileDelete,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="upload-attachments-dialog"
    >
      <DialogTitle id="upload-attachments-dialog">
        Upload Attachments
      </DialogTitle>

      <DialogContent className={classes.root}>
        <Grid container justify="center" alignItems="center" direction="column">
          <AttachmentDropper
            files={files}
            onDrop={onDrop}
            onFileDelete={onFileDelete}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onUpload} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadFileDialog;
