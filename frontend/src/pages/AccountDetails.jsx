import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import base64url from 'base64url';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useLocalStorage from '../utils/auth/useLocalStorage.hook';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "10px",
    },
    paper: {
        width: "100%"
    },
    item: {
        padding: "10px",
        marginLeft: "0",
    },
    center: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "50%",
        marginBottom: '20px',
        marginTop: '40px',
        padding: "40px 10px 40px 10px"
    },
    break: {
        fontWeight: "bold"
    },
    name: {
        color: theme.palette.secondary.main
    }
}));

const AccountDetails = () => {
    const classes = useStyles();
    const [local,] = useLocalStorage('user', {});

    const user = local.firstName + " " + local.lastName;
    const encodedID = base64url(JSON.stringify(local.uniqueId));
    const url = `http://localhost:4000/auth/${encodedID}`;

    const [employee, setEmployee] = useState(null);

    const [edit, setEdit] = useState(false);

    /* Fetch user info */
    useEffect(() => {
        fetch(url)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                }
            })
            .then(json => {
                if (json) {
                    setEmployee(json);
                }
            });
    }, [url]);

    return (
        <div >
            <AccountCircleIcon fontSize="large" color="primary" />
            <Typography variant="h5" className={classes.name}>{user}</Typography>
            <Paper elevation={3} className={classes.center}>
                {
                    employee ?
                        <>
                            <Grid container direction="row">
                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="subtitle1" className={classes.break}>Employee ID:</Typography>
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="body1">{employee.employeeId}</Typography>
                                </Grid>

                            </Grid>

                            <Grid container>

                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="subtitle1" className={classes.break}>Username:</Typography>
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="body1">{employee.username}</Typography>
                                </Grid>

                            </Grid>

                            <Grid container className={classes.break}>

                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="subtitle1" className={classes.break}>Email:</Typography>
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="body1">{employee.email}</Typography>
                                </Grid>

                            </Grid>

                            <Grid container className={classes.break}>

                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="subtitle1" className={classes.break}>Password:</Typography>
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="body1">{'*'.repeat(employee.passwordLength)}</Typography>
                                </Grid>

                            </Grid>
                        </>
                        : null
                }
            </Paper>

            <Button variant="contained" color="primary"  onClick={() => setEdit(true)}>Edit Profile</Button>
        </div>

    )
};

export default AccountDetails;