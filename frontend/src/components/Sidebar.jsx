// author: Maija Kingston
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/drawers/MiniDrawer.js

import React from "react";
import PropTypes from "prop-types";
import * as classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Grid from "@material-ui/core/Grid";

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
import { Link } from "react-router-dom";

const drawerWidth = 220;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
    position: "absolute",
    display: "flex",
    width: drawerWidth,
    flexShrink: 0,
  },

  Sidebar: {
    height: "100%",
    overflow: "hidden",
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
    background: "#60ACBD",
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
    position: "relative",
    background: "#FAFAFA",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    background: "#60ACBD",
    boxShadow: "1px 0px 3px rgba(0,0,0,0.5)",
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
    paddingRight: 10
  }
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          className={classes.Drawer}
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            ),
          }}
          open={this.state.open}
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
                {this.state.open === true ? (
                  <ChevronLeftIcon
                    className={classes.IconButton}
                    onClick={
                      this.state.open === false
                        ? this.handleDrawerOpen
                        : this.handleDrawerClose
                    }
                  />
                ) : (
                    <MenuIcon
                      className={classes.IconButton}
                      onClick={
                        this.state.open === true
                          ? this.handleDrawerClose
                          : this.handleDrawerOpen
                      }
                    />
                  )}
              </Grid>

              {this.state.open === true ? (
                <div>

                  
                    <Grid
                      item
                      container
                      direction="row"
                      alignItems="center"
                      justify="flex-end"
                    >
                      <Grid item>
                        <AccountCircleIcon
                          className={classes.IconButton}
                        />
                      </Grid>
                      <Grid item>
                        {this.state.open === true ? <h5>John Smith</h5> : null}
                      </Grid>
                      <Grid item className={classes.open}>
                        {this.state.open === true ? (
                          <SettingsIcon
                            className={classes.SettingsIcon}
                            style={{ fontSize: 14 }}
                          />
                        ) : null}
                      </Grid>
                    </Grid>
                  
                </div>
              ) : null}
                <Grid item container direction="row" alignItems="center">
                  <Grid item>
                    {this.state.open === false ? (
                      <AccountCircleIcon
                        className={classes.IconButton}
                      />
                    ) : null}
                  </Grid>
                </Grid>

            </Grid>

            <Grid
              className={classes.Grid}
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
                    {this.state.open === true ? <h6>Home</h6> : null}
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
                  className={classes.open}
                >
                  <Grid item>
                    <LocalShippingIcon className={classes.IconButton} />
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? <h6>Shipping</h6> : null}
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? (
                      <KeyboardArrowDownIcon style={{ fontSize: 10 }} />
                    ) : null}
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
                  className={classes.onClick}
                >
                  <Grid item>
                    {this.state.open === true ? (
                      <ListIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? <h6>View All</h6> : null}
                  </Grid>
                </Grid>
              </Link>

              <Link to="/shipments/track" className={classes.link}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {this.state.open === true ? (
                      <GpsFixedIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? <h6>Track</h6> : null}
                  </Grid>
                </Grid>
              </Link>
              <Link to="/shipments/create" className={classes.link}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {this.state.open === true ? (
                      <AddCircleOutlineIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? <h6>Add New</h6> : null}
                  </Grid>
                </Grid>
              </Link>

              <Link to="/assets/view-all" className={classes.link}>
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
                    {this.state.open === true ? <h6>Assets</h6> : null}
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? (
                      <KeyboardArrowDownIcon style={{ fontSize: 10 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                </Grid>
              </Link>

              <Link to="/assets/view-all" className={classes.link}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {this.state.open === true ? (
                      <ListIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? <h6> View All </h6> : null}
                  </Grid>
                </Grid>
              </Link>

              <Link to="/assets/create-assembly" className={classes.link}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {this.state.open === true ? (
                      <DynamicFeedIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? <h6>Assembly</h6> : null}
                  </Grid>
                </Grid>
              </Link>

              <Link to="/assets/assignments" className={classes.link}>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  className={classes.onClick}
                >
                  <Grid item>
                    {this.state.open === true ? (
                      <AssignmentIndIcon style={{ fontSize: 17 }} className={classes.icon} />
                    ) : null}
                  </Grid>
                  <Grid item>
                    {this.state.open === true ? <h6>Assignments</h6> : null}
                  </Grid>
                </Grid>
              </Link>
            </Grid>


            <Grid
              container
              direction="column"
              justify="flex-end"
              alignItems="center"
              className={classes.Grid}
            >
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item>
                  {this.state.open === true ? (
                    <Link to="/sign-out" className={classes.link}>
                    <h6 className={classes.ExitToAppIcon}>Sign Out</h6>
                    </Link>
                  ) : null}
                </Grid>
                <Grid item>
                  <Link to="/sign-out" className={classes.link}>
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
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Sidebar);
