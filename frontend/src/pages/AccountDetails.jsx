import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import AssetFilter from '../components/Dialogs/AssetFilter';
import EventFilter from '../components/Dialogs/EventFilter';
import Header from '../components/Header';
import CustomTable from '../components/Tables/CustomTable'
import TableToolbar from '../components/Tables/TableToolbar';
import ChipBar from '../components/Tables/ChipBar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'

const assetFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];
const eventFields = ["key", "eventTime", "eventType"];
const employeeID = "123456";
const username = "jsmith";
const email = "johnsmith@gmail.com";
const password = "*******";

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "10px",
    },
    paper: {
        width: "100%",
    },
    item: {
        padding: "10px",

    },
    center: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "50%",
        backgroundColor: "white",
        marginBottom: '20px',
        marginTop: '40px',
    },
    break: {
        flexGrow: 1,
        fontWeight: "bold"
    },
    grid: {
        alignItems: "center",
    }
   
}));
const AccountDetails = () => {
    
	const classes = useStyles();

    return (
        <div >
            <Header heading="John Smith" />
            <div className={classes.center}>
                <Grid container>
                	
                	<Grid item xs={3} className={classes.item}>
                         <Typography variant="subtitle1" className={classes.break}>Employee ID:</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                    	<Typography variant="body1">{employeeID}</Typography>
                    </Grid>
                          
                </Grid >

                <Grid container>
                	
                	<Grid item xs={3} className={classes.item}>
                         <Typography variant="subtitle1" className={classes.break}>Username:</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                    	<Typography variant="body1">{username}</Typography>
                    </Grid>
                          
                </Grid >

                <Grid container>
                	
                	<Grid item xs={3} className={classes.item}>
                         <Typography variant="subtitle1" className={classes.break}>Email:</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                    	<Typography variant="body1">{email}</Typography>
                    </Grid>
                          
                </Grid >

                <Grid container>
                	
                	<Grid item xs={3} className={classes.item}>
                         <Typography variant="subtitle1" className={classes.break}>Password:</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                    	<Typography variant="body1">{password}</Typography>
                    </Grid>
                          
                </Grid >
            </div>

            <Button variant="contained" color="primary">
            Edit Profile
            </Button>


      


          
        </div>

    )
};

export default AccountDetails;