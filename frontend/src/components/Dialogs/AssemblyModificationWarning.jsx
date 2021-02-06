import React from 'react';

//Library Tools
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Components
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

//Icons
import WarningIcon from '@material-ui/icons/Warning';

//Tools
import useLocalStorage from '../../utils/auth/useLocalStorage.hook'

const useStyles = makeStyles({
    warning: {
        fontSize: "100px",
        color: "#E5C92D"
    },
    confirm: {
        marginTop: "40px"
    },
    header: {
        backgroundColor: "#EBEBEB"
    },
    body: {
        backgroundColor: "#FAFAFA",
        textDecoration: "none",
    },
    container: {
        marginTop: "20px"
    },
    table: {
        minWidth: "300px",
        flexGrow: 1
    },
    root: {
        padding: "0px 25px 0px 25px"
    }
});

const AssemblyModificationWarning = ({ open, setOpen, assembly }) => {
    const classes = useStyles();
    const history = useHistory();
    const [user,] = useLocalStorage('user', {});

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>Modifying Assembly</DialogTitle>

            <DialogContent className={classes.root}>
                <Grid container justify="center" alignItems="center" direction="column">
                    <Grid item xs={12}>
                        <WarningIcon className={classes.warning} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" style={{ textAlign: "center" }}>Modifying this assembly will mark it as disassembled</Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.confirm}>
                        <Typography variant="body1">Do you wish to continue?</Typography>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>

                {/* Mark assembly as disassembled in the database prior to redirecting to the assembly modification tool */}
                <Button
                    onClick={() => {
                        fetch("http://localhost:4000/assets", {
                            method: "PATCH",
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                assets: [assembly.serial],
                                update: {
                                    assembled: false
                                },
                                disassembly: true,
                                user: user.uniqueId
                            })
                        })
                        history.push({
                            pathname: '/assets/create-assembly',
                            state: {
                                isAssemblyEdit: true,
                                serial: assembly.serial,
                                assemblyType: assembly.assetName
                            }
                        })
                    }}
                    color="primary">Modify</Button>

            </DialogActions>
        </Dialog>
    )
}

export default AssemblyModificationWarning;