import React from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography';

import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DomainIcon from "@material-ui/icons/Domain";

import Searchbar from '../components/Searchbar/Searchbar';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    moduleHeader: {
        marginTop: "40px",
        marginLeft: "100px",
        flexGrow: "1",
        alignSelf: "flex-start"
    },
    moduleName: {
        
        color:"#2E474E",
        flexGrow: "1",
        //alignSelf: "flex-start"
    },
    moduleIcon: {
        fontSize: "100px",
        padding: "20px",
        marginLeft: "40px",
        marginRight: "40px",
        backgroundColor: "#71AABB",
        color: "white",
        borderRadius: "3px",
        //border: "1px solid #2E474E",
        boxShadow: "2px 2px 3px #888888"

    },
    moduleContainer: {
        display: "flex",
        flexDirection: "column"
    },
    link: {
        
        textDecoration: "none",
        cursor: "pointer"
    }
})

const Dashboard = () => {
    const classes = useStyles();

    return (
        <div>
            <Header heading="Dashboard" />
            <Searchbar />
            <div className={classes.moduleContainer}>
                <Typography variant="h5" className={classes.moduleHeader}>Modules</Typography>
                <div>
                    <Link to="/shipments/view-all" className={classes.link}>
                        <LocalShippingIcon className={classes.moduleIcon} />
                        <Typography variant="h5" className={classes.moduleName}>Shipping</Typography>

                    </Link>
                    <Link to="/assets/view-all" className={classes.link}>
                        <DomainIcon className={classes.moduleIcon} />
                        <Typography variant="h5" className={classes.moduleName}>Assets</Typography>
                    </Link>
                </div>
            </div>
        </div>
    );

}

export default Dashboard;