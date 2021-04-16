import React, { useEffect, useState } from 'react';

//Library Tools
import { makeStyles } from '@material-ui/core/styles';
import base64url from 'base64url';

//Material-UI Imports
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

//Icons
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

//Tools
import useLocalStorage from '../utils/auth/useLocalStorage.hook';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "10px",
    },
    paper: {
        width: "100%"
    },
    item: {
        padding: "6px",
        marginTop: "5px",
        marginLeft: "0",
    },
    center: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "60%",
        marginBottom: '20px',
        marginTop: '40px',
        padding: "30px 0px 30px 0px"
    },
    break: {
        fontWeight: "bold",
        marginTop: props => props.isEdit ? "5px" : "0px"
    },
    name: {
        color: theme.palette.secondary.main
    },
    error: {
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto"
    }
}));

const AccountDetails = () => {
    const [local,] = useLocalStorage('user', {});
    const user = local.firstName + " " + local.lastName;

    const encodedID = base64url(JSON.stringify(local.uniqueId));
    const url = `${process.env.REACT_APP_API_URL}/auth/${encodedID}`;

    const [employee, setEmployee] = useState(null);
    const [state, setState] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        visible: false,
        result: null
    });
    const [error, setError] = useState("");
    const [edit, setEdit] = useState(false);
    const [alert, setAlert] = useState(null);

    const classes = useStyles({ isEdit: edit });

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

    /* Check that passwords match */
    useEffect(() => {
        if (state.password !== state.confirmPassword) {
            setError("Passwords do not match");
        } else {
            setError("");
        }
    }, [state.password, state.confirmPassword]);

    /* Sign in text box change handler */
    const handleChange = (event) => {
        setError("");
        setState({
            ...state,
            [event.target.name]: event.target.value,
            result: null
        });
    };

    /* Reset edited fields */
    const handleCancel = (event) => {
        setEdit(false);
        setError("");
        setState({
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            visible: false,
        });
    }

    /* Submits updated account data */
    const handleSubmit = () => {
        let data = {
            user: local.uniqueId
        };
        if (state.username) {
            data.username = state.username;
        }

        if (state.email) {
            data.email = state.email;
        }

        if (state.password) {
            if (!state.confirmPassword) {
                setError("Missing password confirmation");
                return;
            } else if (state.confirmPassword !== state.password) {
                setError("Passwords do not match!");
                return;
            } else data.password = state.password;

        } else if (!state.password && state.confirmPassword) {
            setError("Password field is empty");
            return;
        }

        try {
            fetch(`${process.env.REACT_APP_API_URL}/employees/${employee.employeeId}`, {
                method: 'PATCH',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return null;
                }
            })
                .then(json => {
                    if (json) {
                        setAlert({ type: "success", message: "Updated user information" });
                        setEmployee(emp => ({ ...emp, ...data }));
                        handleCancel();
                    } else {
                        setAlert({ type: "error", message: "Could not update profile..." });
                    }

                }).catch(() => {
                    setAlert({ type: "error", message: "Could not update profile..." });
                })

        } catch (e) {
            console.log(e);
            setAlert({ type: "error", message: "Could not update profile..." });
        }
    }

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

                                    {
                                        edit === false ?
                                            <Typography variant="body1">{employee.username}</Typography>
                                            : <TextField
                                                id="username-edit"
                                                name="username"
                                                label={"Username"}
                                                variant="outlined"
                                                size="small"
                                                value={state.username}
                                                placeholder={employee.username}
                                                onChange={handleChange} />
                                    }
                                </Grid>

                            </Grid>

                            <Grid container className={classes.break}>

                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="subtitle1" className={classes.break}>Email:</Typography>
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    {
                                        edit === false ?
                                            <Typography variant="body1">{employee.email}</Typography>
                                            : <TextField
                                                id="email-edit"
                                                label="Email"
                                                variant="outlined"
                                                name="email"
                                                size="small"
                                                value={state.email}
                                                placeholder={employee.email}
                                                onChange={handleChange} />
                                    }
                                </Grid>

                            </Grid>

                            <Grid container className={classes.break}>

                                <Grid item xs={6} className={classes.item}>
                                    {
                                        edit === false ?
                                            <Typography variant="subtitle1" className={classes.break}>Password:</Typography>
                                            : <Typography variant="subtitle1" className={classes.break}>New Password:</Typography>}
                                </Grid>
                                <Grid item xs={6} className={classes.item}>

                                    {
                                        edit === false ?
                                            <Typography variant="body1">{'*'.repeat(employee.passwordLength)}</Typography>
                                            : <TextField
                                                id="password-edit"
                                                label="New Password"
                                                variant="outlined"
                                                name="password"
                                                size="small"
                                                value={state.password}
                                                onChange={handleChange} />
                                    }
                                </Grid>

                            </Grid>
                            {
                                edit === true ?
                                    <Grid container className={classes.break}>
                                        <Grid item xs={6} className={classes.item}>
                                            <Typography variant="subtitle1" className={classes.break}>Confirm Password:</Typography>
                                        </Grid>
                                        <Grid item xs={6} className={classes.item}>
                                            <TextField
                                                id="confirm-password"
                                                label="Confirm Password"
                                                variant="outlined"
                                                name="confirmPassword"
                                                size="small"
                                                value={state.confirmPassword}
                                                onChange={handleChange} />
                                        </Grid>

                                        {/* Form error display */}
                                        {
                                            error &&
                                            (
                                                <Grid item xs={6} className={classes.error}>

                                                    <br />
                                                    <Typography
                                                        variant="caption"
                                                        style={{
                                                            color: "red",
                                                            fontWeight: "bold"
                                                        }}>
                                                        ERROR: {error}
                                                    </Typography>

                                                </Grid>
                                            )
                                        }


                                    </Grid> : null
                            }
                        </>
                        : null
                }
            </Paper>

            {
                edit === false ?
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => setEdit(true)}>Edit Profile</Button>
                    :
                    <>
                        <Button
                            variant="outlined"
                            size="small"
                            style={{
                                marginRight: "10px",
                                color: "red",
                                border: "1px solid red"
                            }}
                            onClick={handleCancel}>Cancel</Button>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            size="small"
                            onClick={handleSubmit}>Submit</Button>
                    </>
            }

            {/* Success / Failure alert for updates */}
            <Snackbar
                open={Boolean(alert)}
                autoHideDuration={5000}
                onClose={() => setAlert(null)}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>

                <Alert
                    onClose={() => setAlert(null)}
                    severity={alert?.type}
                    style={{
                        boxShadow: "1px 1px 4px #000000",
                        borderRadius: "3px"
                    }}
                >

                    {alert?.message}
                </Alert>

            </Snackbar>

        </div>

    )
};

export default AccountDetails;