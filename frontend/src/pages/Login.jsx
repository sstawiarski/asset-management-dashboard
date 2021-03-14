import React, { useState, useEffect } from 'react';

//Library Tools
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Redirect } from 'react-router-dom';

//Material-UI Components
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

//Icons
import logo from "../logo.svg"
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

//Tools
import useLocalStorage from '../utils/auth/useLocalStorage.hook';

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundColor: "#71AABB",
        minHeight: "100vh"
    },
    box: {
        position: "fixed",
        top: "50%",
        left: "50%",
        backgroundColor: "#f2f2f2",
        height: "40vh",
        width: "40vw",
        minHeight: "400px",
        maxHeight: "400px",
        marginTop: "-20vh",
        marginLeft: "-20vw",
        borderRadius: "4px",
        textAlign: "center",
        boxShadow: "1px 3px 7px #575757"
    },
    imgBox: {
        borderRadius: "50%",
        backgroundColor: "#f2f2f2",
        height: "125px",
        width: "125px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "-11%",
        boxShadow: "0px 1px 3px #2e2e2e"
    },
    signIn: {
        width: "75%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "30px"
    },
    loginButton: {
        position: "relative",
        marginTop: "30px",
        float: "right"
    },
    error: {
        color: "red"
    }
}))

const LoginPage = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const [local, setLocal] = useLocalStorage('user', {}); //user login control

    /* Sign in text box state */
    const [state, setState] = useState({
        userId: "",
        password: "",
        visible: false,
        result: null
    });

    /* Display message for 5 seconds whenever a user logs out */
    useEffect(() => {
        if (history.location.state) {
            if (history.location.state.onSignOut) {
                setTimeout(() => {
                    history.replace('/login', null);
                }, 5000);
            }
        }
    }, [history]);

    /* Sign in text box change handler */
    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
            result: null
        });
    };

    /* Submits login information and handler results */
    const handleSubmit = (event) => {
        event.preventDefault();

        let body = {};
        if (state.userId.includes('@')) {
            body.email = state.userId;
        } else {
            body.username = state.userId;
        }
        body.password = state.password;

        fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(json => {
                if (json.message) {
                    setState(s => ({ ...s, result: json.message }));
                } else {
                    setLocal(json);
                    window.location.href = '/';
                }
            });
    }

    return (
        <div className={classes.background}>

            {/* If logged in, redirect to the dashboard */}
            {Object.keys(local).length > 0 ? <Redirect to='/' /> : null}

            <div className={classes.box}>
                <div className={classes.imgBox}>
                    <img src={logo} alt="logo" />
                </div>
                <Typography variant="h4">Sign In</Typography>
                <div className={classes.signIn}>
                    <Grid container direction="column" spacing={3}>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                label="Username or Email"
                                name="userId"
                                value={state.userId}
                                error={Boolean(state.result)}
                                onChange={handleChange}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") handleSubmit(event);
                                }}
                                fullWidth />
                        </Grid>
                        <Grid item>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <OutlinedInput
                                    label="Password"
                                    id="password"
                                    name="password"
                                    error={Boolean(state.result)}
                                    type={state.visible ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setState(s => ({ ...s, visible: !s.visible }))}
                                                edge="end"
                                            >
                                                {state.visible ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={state.password}
                                    onChange={handleChange}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") handleSubmit(event);
                                    }}
                                    fullWidth />
                            </FormControl>
                        </Grid>

                        {/* Display error results when login information is incorrect */}
                        {
                            state.result ?
                                <Grid item>
                                    <Typography variant="subtitle2" className={classes.error}><b>ERROR: {state.result}</b></Typography>
                                </Grid>
                                : null
                        }
                    </Grid>

                    <div className={classes.loginButton}>
                        <Button type="submit" color="secondary" variant="outlined" onClick={handleSubmit}>Login</Button>
                    </div>

                    {/* Display message when user logs out */}
                    {
                        history.location.state ?
                            <Typography style={{ textAlign: "left" }} variant="subtitle2"><i>Signed out from {history.location.state.name.firstName} {history.location.state.name.lastName}</i></Typography>
                            : null
                    }
                </div>

            </div>
        </div>
    );
};

export default LoginPage;