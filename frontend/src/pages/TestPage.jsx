import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import { Button, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import ChangeGroupTagDialog from '../components/Dialogs/ChangeGroupTagDialog';

import Header from '../components/Header';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({

})

const selected = ["G800-1111"];

const TestPage = () => {
    const classes = useStyles();

    const [groupTagOpen, setGroupTagOpen] = useState(false);
    const [groupTagResponse, setGroupTagResponse] = useState("")

    return (
        <div>
            <Header heading="Test Page" />
            <Button onClick={() => setGroupTagOpen(true)} variant="contained" color="primary">Open Group Tag Dialog</Button>


            {/* Actual dialog and response bar */}
            <ChangeGroupTagDialog open={groupTagOpen} setOpen={setGroupTagOpen} selected={selected} onResponse={setGroupTagResponse} />
            <Snackbar
                open={groupTagResponse !== ""}
                autoHideDuration={5000}
                onClose={() => setGroupTagResponse("")}>
                <Alert
                    onClose={() => setGroupTagResponse("")}
                    severity={groupTagResponse}
                >
                    {groupTagResponse === "success" ? "Successfully updated group tag" : "Failed to update group tag!"}
                </Alert>
            </Snackbar>

        </div>
    );

}

export default TestPage;