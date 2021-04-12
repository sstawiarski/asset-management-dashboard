import React from 'react';

//Library Tools
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Components
import Typography from '@material-ui/core/Typography';

//Icons
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DomainIcon from "@material-ui/icons/Domain";

//Custom Components
import Searchbar from '../components/Searchbar/Searchbar';
import Header from '../components/General/Header';

const useStyles = makeStyles({
    moduleHeader: {
        marginTop: "40px",
        flexGrow: "1",
        alignSelf: "center"
    },
    moduleName: {
        color:"#2E474E",
        flexGrow: "1",
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
    Modules: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px"
    },
    moduleContainer: {
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
                <div className={classes.Modules}>
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