// author: Maija Kingston
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/drawers/MiniDrawer.js

import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import * as classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DomainIcon from "@material-ui/icons/Domain";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ListIcon from "@material-ui/icons/List";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import ExtensionIcon from '@material-ui/icons/Extension';
import { Link } from "react-router-dom";
import useLocalStorage from '../utils/auth/useLocalStorage.hook';

let drawerWidth = 220;

const useStyles = makeStyles(theme => ({
  root: {

  },

  Sidebar: {
    minHeight: "100vh",
    border: "none"
  },

  IconButton: {
    padding: 10,
    marginLeft: 10,
    color: "#294950",
    "&:hover": {
      color: "#8ab7c2",
    },
  },

  AccountCircleIcon: {
    background: "#60ACBD"
  },

  open: {
    "&:hover": {
      color: "#8ab7c2",
    },
  },

  onClick: {
    marginLeft: 50,
    "&:hover": {
      color: "#8ab7c2",
    },
  },

  SettingsIcon: {
    marginLeft: 50,
  },
  ExitToAppIcon: {
    padding: 10,
    marginLeft: 10,
    color: "#EA5F61",
  },
  drawerPaper: {
    background: "#FAFAFA",
    overflowX: "hidden",
    position: "relative",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    position: "relative",
    background: "#60ACBD",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  link: {
    color: "inherit",
    textDecoration: "none",
    paddingLeft: "5px",
    display: "inherit"
  },
  icon: {
    paddingRight: 10,
  },
  name: {
    color: "white",
    textShadow: "1px 1px 4px #0f0f0f"
  },

}));

const Sidebar = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useLocalStorage('user', {});
  const history = useHistory();

  const fullName = local.firstName + " " + local.lastName;

  const handleDrawerOpen = () => {
    setOpen(true);
    props.onOpen("#FAFAFA");
  };

  const handleDrawerClose = () => {
    setOpen(false);
    props.onOpen("#60ACBD");
  };

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        className={classes.Drawer}
        classes={{
          paper: classNames(
            classes.drawerPaper,
            !open && classes.drawerPaperClose
          ),
        }}
        style={{
          width: local.firstName ? fullName.length > 9 ? open ? drawerWidth + fullName.length + 35 : 73 : drawerWidth : open ? 220 : 73
        }}
        open={open}
      >
        <div className={classes.Sidebar}>
          <Grid
            className={classes.AccountCircleIcon}
            container
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            spacing={1}


          >
            <Grid item>
              {open === true ? (
                <ChevronLeftIcon
                  className={classes.IconButton}
                  onClick={
                    open === false
                      ? handleDrawerOpen
                      : handleDrawerClose
                  }
                />
              ) : (
                  <MenuIcon
                    className={classes.IconButton}
                    onClick={
                      open === true
                        ? handleDrawerClose
                        : handleDrawerOpen
                    }
                  />
                )}
            </Grid>

            {open === true ? (
              <div>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"

                >
                  <Link to="/AccountDetails">
                  <Grid item>
                    <AccountCircleIcon
                      className={classes.IconButton}
                    />
                  </Grid>
                  </Link>
                  <Grid item>
                    {open === true ? <Typography variant="h6" className={classes.name}>{fullName}</Typography> : null}
                  </Grid>
                  <Grid item className={classes.open}>
                    {open === true ? (
                      <SettingsIcon
                        className={classes.SettingsIcon}
                        style={{ fontSize: 16 }}
                      />
                    ) : null}
                  </Grid>
                </Grid>

              </div>
            ) : null}
            <Grid item container direction="row" alignItems="center">
              <Grid item>
                {open === false ? (
                  <Link to="/AccountDetails">
                  <AccountCircleIcon
                    className={classes.IconButton}
                  />
                  </Link>
                ) : null}
              </Grid>
            </Grid>

          </Grid>

          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            spacing={1}
          >
            <Link to="/" className={classes.link}>
              <Grid
                item
                container
                direction="row"
                alignItems="center"
                justify="flex-start"
              >
                <Grid item>
                  <HomeIcon
                    className={classes.IconButton}
                  />
                </Grid>
                <Grid item className={classes.open}>
                  {open === true ? <Typography variant="body1">Home</Typography> : null}
                </Grid>
              </Grid>
            </Link>

            <Link to="/shipments/view-all" className={classes.link}>
              <Grid
                item
                container
                direction="row"
                alignItems="center"
                justify="flex-start"
              >
                <Grid item>
                  <LocalShippingIcon className={classes.IconButton} />
                </Grid>
                <Grid item>
                  {open === true ? <Typography variant="body1">Shipping</Typography> : null}
                </Grid>
                <Grid item>
                  {open === true ? (
                    <KeyboardArrowDownIcon style={{ fontSize: 10 }} />
                  ) : null}
                </Grid>
              </Grid>
            </Link>

            <Link to="/shipments/view-all" className={classes.link}>
              <div style={{ marginBottom: "10px" }}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {open === true ? (
                      <ListIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {open === true ? <Typography variant="body2">View All</Typography> : null}
                  </Grid>
                </Grid>
              </div>
            </Link>

            <Link to="/shipments/track" className={classes.link}>
              <div style={{ marginBottom: "10px" }}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {open === true ? (
                      <GpsFixedIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {open === true ? <Typography variant="body2">Track</Typography> : null}
                  </Grid>
                </Grid>
              </div>
            </Link>
            <Link to="/shipments/create" className={classes.link}>
              <div style={{ marginBottom: "10px" }}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {open === true ? (
                      <AddCircleOutlineIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {open === true ? <Typography variant="body2">Add New</Typography> : null}
                  </Grid>
                </Grid>
              </div>
            </Link>

            <Link to="/assets/view-all" className={classes.link}>
              <div style={{ marginTop: "-15px" }}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                >
                  <Grid item>
                    <DomainIcon className={classes.IconButton} />
                  </Grid>
                  <Grid item className={classes.open}>
                    {open === true ? <Typography variant="body1">Assets</Typography> : null}
                  </Grid>
                  <Grid item>
                    {open === true ? (
                      <KeyboardArrowDownIcon style={{ fontSize: 10 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                </Grid>
              </div>
            </Link>

            <Link to="/assets/view-all" className={classes.link}>
              <div style={{ marginBottom: "10px" }}>


                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {open === true ? (
                      <ListIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {open === true ? <Typography variant="body2"> View All </Typography> : null}
                  </Grid>
                </Grid>
              </div>
            </Link>

            <Link to="/assets/create-assembly" className={classes.link}>
              <div style={{ marginBottom: "10px" }}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}

                >
                  <Grid item>
                    {open === true ? (
                      <ExtensionIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {open === true ? <Typography variant="body2">Assembly Manager</Typography> : null}
                  </Grid>
                </Grid>
              </div>
            </Link>

            <Link to="/assets/assignments" className={classes.link}>
              <div style={{ marginBottom: "20px" }}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {open === true ? (
                      <AssignmentIndIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {open === true ? <Typography variant="body2">Assignments</Typography> : null}
                  </Grid>
                </Grid>
              </div>
            </Link>
          </Grid>


          <Grid
            container
            direction="column"
            justify="flex-end"
            alignItems="center"
          >
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                {open === true ? (
                  <Link to={{
                    pathname: '/login', state: { onSignOut: true, name: local }
                  }}
                    onClick={() => {
                      setLocal(null);
                    }}
                    className={classes.link}>
                    <Typography variant="body1" className={classes.ExitToAppIcon}>Sign Out</Typography>
                  </Link>
                ) : null}
              </Grid>
              <Grid item>
                <Link to={{
                  pathname: '/login', state: { onSignOut: true, name: local }
                }}
                  onClick={() => {
                    setLocal(null);
                  }}
                  className={classes.link}>
                  <ExitToAppIcon className={classes.ExitToAppIcon} />
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Drawer>
    </div>
  );
}

Sidebar.propTypes = {
};

export default Sidebar;
