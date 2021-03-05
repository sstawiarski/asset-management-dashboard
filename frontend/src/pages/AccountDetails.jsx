import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import base64url from 'base64url';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useLocalStorage from '../utils/auth/useLocalStorage.hook';
import TextField from "@material-ui/core/TextField";
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
    const [username, setUsername] = useState("");
    const [local,] = useLocalStorage('user', {});

    const user = local.firstName + " " + local.lastName;
    const encodedID = base64url(JSON.stringify(local.uniqueId));
    const url = `http://localhost:4000/auth/${encodedID}`;

    const [employee, setEmployee] = useState(null);

    const [edit, setEdit] = useState(false);

    const [state, setState] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        visible: false,
        result: null
    });

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

     /* Sign in text box change handler */
    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
            result: null
        });
    };

     /* Submits updated account data */
    const handleSubmit = (event) => {
        event.preventDefault();

        let body = {};
        body.username = state.username;

        
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
                                   
                                    {edit==false ? <Typography variant="body1">{employee.username}</Typography> : <form><TextField id="outlined-basic" name="username" label={employee.username} variant="outlined" value={state.username}
                                        onChange={handleChange} /></form>
                                    }
                                </Grid>

                            </Grid>

                            <Grid container className={classes.break}>

                                <Grid item xs={6} className={classes.item}>
                                    <Typography variant="subtitle1" className={classes.break}>Email:</Typography>
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    {edit==false ? <Typography variant="body1">{employee.email}</Typography> : <form><TextField id="outlined-basic" label={employee.email} variant="outlined" name ="email" value={state.email} onChange={handleChange} /></form>}
                                </Grid>

                            </Grid>

                            <Grid container className={classes.break}>

                                <Grid item xs={6} className={classes.item}>
                                    {edit==false ? <Typography variant="subtitle1" className={classes.break}>Password:</Typography> : <Typography variant="subtitle1" className={classes.break}>New Password:</Typography> }
                                </Grid>
                                <Grid item xs={6} className={classes.item}>

                                    {edit==false ? <Typography variant="body1">{'*'.repeat(employee.passwordLength)}</Typography> : <form><TextField id="outlined-basic" label="new password" variant="outlined" name="password" value={state.password} onChange={handleChange} /></form>}
                                </Grid>
                            
                            </Grid>
                            {edit==true ? 
                                <Grid container className={classes.break}>
	                                <Grid item xs={6} className={classes.item}>
	                                    <Typography variant="subtitle1" className={classes.break}>Confirm Password:</Typography>
	                                </Grid>
                                    <Grid item xs={6} className={classes.item}>
                                        <form><TextField id="outlined-basic" label="new password" variant="outlined" name="confirmPassword" value={state.confirmPassword} onChange={handleChange} /></form>
                                    </Grid>

                                </Grid> : null
                            }
                        </>
                        : null
                }
            </Paper>

            {edit==false ? <Button variant="contained" color="primary"  onClick={() => setEdit(true)}>Edit Profile</Button> : <div><Button variant="contained" color="primary"  onClick={() => setEdit(false)}>Cancel</Button> <Button variant="contained" color="primary"  onClick={handleSubmit}>Submit</Button></div> }
        </div>

    )
};

export default AccountDetails;