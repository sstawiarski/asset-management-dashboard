import React, { useState } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

//Material-UI Imports
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

//Icons
import ListIcon from "@material-ui/icons/List";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import ExtensionIcon from '@material-ui/icons/Extension';
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HomeIcon from "@material-ui/icons/Home";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DomainIcon from "@material-ui/icons/Domain";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";

//Tools
import useLocalStorage from '../../utils/auth/useLocalStorage.hook';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    menuIcon: {
        marginRight: 5,
        [theme.breakpoints.up('sm')]: {
            marginRight: 20,
        },
    },
    name: {
        color: "white",
        textShadow: "1px 1px 4px #0f0f0f",
        flexBasis: "100%",
        cursor: "pointer"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
        backgroundColor: theme.palette.primary.main
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(1, 0, 0, 0),
        flexWrap: "wrap",
        backgroundColor: theme.palette.primary.main
    },
    accountHeader: {
        flexBasis: "100%"
    },
    moduleText: {
        color: "#3b3a3a"
    },
    signOut: {
        color: "#EA5F61",
        marginTop: "5rem"
    },
    highlighted: {
        color: "#ddebee"
    },
    nonHighlighted: {
        color: "rgba(0, 0, 0, 0.6)"
    },
    accountCircleIcon: {
        marginLeft: "65%",
        [theme.breakpoints.up('sm')]: {
            marginLeft: "24px",
            width: "auto"
        },
    }
}));

/* Get icon for the specified sidebar link title */
const getIcon = (name) => {
    switch (name) {
        case "Home":
            return <HomeIcon />
        case "Assets":
            return <DomainIcon />
        case "Shipments":
            return <LocalShippingIcon />
        case "Sign Out":
            return <ExitToAppIcon style={{ color: "#EA5F61" }} />
        case "View All":
            return <ListIcon />
        case "Track":
            return <GpsFixedIcon />
        case "Add New":
            return <AddCircleOutlineIcon />
        case "Assembly Manager":
            return <ExtensionIcon />
        case "Assignments":
            return <AssignmentIndIcon />
        default:
            return null;
    }
};

/* Get the url for the specified link name
 * Pass in the logged in user so a logout message can be displayed on the login screen
 */
const getURL = (name, loggedInUser) => {
    switch (name) {
        case "Home":
            return "/"
        case "Sign Out":
            return { pathname: '/login', state: { onSignOut: true, name: loggedInUser } }
        case "View All Assets":
            return "/assets/view-all"
        case "View All Shipments":
            return "/shipments/view-all"
        case "Track":
            return "/shipments/track"
        case "Add New":
            return "/shipments/create"
        case "Assembly Manager":
            return "/assets/assembly-manager"
        case "Assignments":
            return "/assets/assignments"
        default:
            return null;
    }
};

/**
 * Route matching to determine highlighted link in sidebar
 * Highlights parent module if sidebar is closed, individual link if sidebar is open
 * 
 * @param {} location 
 * @param {*} link 
 * @param {*} open 
 */
const isHighlighted = (location, link, open) => {
    if (location) {
        const text = location.pathname;
        if (text.includes('/assets') && link === 'Assets') {
            return true;
        } else if (text.includes('/shipments') && link === 'Shipments') {
            return true;
        } else if (text === '/' && link === "Home") {
            return true;
        } else if (text === "/assets/view-all" && link === "View All Assets" && open) {
            return true;
        } else if (text === "/assets/assembly-manager" && link === "Assembly Manager" && open) {
            return true;
        } else if (text === "/assets/assignments" && link === "Assignments" && open) {
            return true;
        } else if (text === "/shipments/view-all" && link === "View All Shipments" && open) {
            return true;
        } else if (text === "/shipments/track" && link === "Track" && open) {
            return true;
        } else if (text === "/shipments/create" && link === "Add New" && open) {
            return true;
        } else if (text === "/account" && link === "Account" && !open) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

const assetPages = ['View All', 'Assembly Manager'];
const shipmentPages = ['View All', 'Add New'];
const sidebarSections = ['Home', 'Assets', 'Shipments', 'Sign Out'];

const Sidebar = ({ location }) => {
    const classes = useStyles();
    const history = useHistory();

    /* Main drawer open state */
    const [open, setOpen] = useState(false);

    /* Open state for the dropdowns of additional links for both modules */
    const [openAssetCollapse, setOpenAssetCollapse] = useState(false);
    const [openShipmentCollapse, setOpenShipmentCollapse] = useState(false);

    /* Logged in user state for rendering the name in the sidebar */
    const [local, setLocal] = useLocalStorage('user', {});

    const fullName = local.firstName + " " + local.lastName;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <CssBaseline />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>

                    {/* Drawer open and close button */}
                    <IconButton
                        onClick={open ? handleDrawerClose : handleDrawerOpen}
                        className={open ? "sidebar-close-icon" : classes.menuIcon}
                        style={open ? { marginRight: "8px" } : null}
                    >
                        {
                            open ?
                                <ChevronRightIcon />
                                : <MenuIcon />
                        }
                    </IconButton>

                    {/* Account icon, name, and settings header section */}
                    <List className={classes.accountHeader}>
                        <ListItem button={!open} style={open ? { marginLeft: "-20px" } : null} disableRipple={!open}>
                            {/* Render account icon as one of 2 types of buttons for better styling open vs. closed */}
                            {
                                open ?
                                    <IconButton
                                        size="small"
                                        disableRipple
                                        style={{ marginLeft: "20px", marginRight: "10px" }}
                                        onClick={() => history.push('/account')}
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                    :
                                    <ListItemIcon onClick={() => history.push('/account')}>
                                        <AccountCircleIcon
                                            
                                            className={[isHighlighted(location, "Account", open) ?
                                                !open ? classes.highlighted : classes.moduleText
                                                : classes.nonHighlighted, classes.accountCircleIcon].join(' ')}
                                        />
                                    </ListItemIcon>
                            }

                            {/* Logged in user name */}
                            <ListItemText
                                primary={fullName}
                                onClick={() => history.push('/account')}
                                className={classes.name}
                                title="Account details"
                                primaryTypographyProps={{ variant: "h6", style: !open ? { width: 0, visibility: "hidden" } : null }}
                            />


                            {/* Settings icon */}
                            <IconButton
                                size="small"
                                disableRipple
                                disabled={true}
                                style={!open ? { width: 0, visibility: "hidden" } : null}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    history.push('/settings');
                                }}
                            >
                                <SettingsIcon style={!open ? { width: 0, visibility: "hidden" } : null} />
                            </IconButton>

                        </ListItem>
                    </List>
                </div>

                {
                    open ?
                        <Divider />
                        : null
                }

                {/* Generate list of actual sidebar links */}
                <List>
                    {
                        sidebarSections.map(text => {
                            return (
                                <React.Fragment key={text}>
                                    <ListItem
                                        button={true}
                                        disableRipple={true}
                                        className={text === "Sign Out" ? classes.signOut : null}
                                        onClick={() => {

                                            /* Change link types depending on open or closed and make sign out link action custom */
                                            if (text === "Assets") {
                                                if (open) setOpenAssetCollapse(!openAssetCollapse);
                                                else history.push(getURL("View All Assets"));
                                            } else if (text === "Shipments") {
                                                if (open) setOpenShipmentCollapse(!openShipmentCollapse);
                                                else history.push(getURL("View All Shipments"));
                                            } else if (text === "Sign Out") {
                                                history.push(getURL("Sign Out", local));
                                                setLocal(null);
                                            } else {
                                                history.push(getURL(text));
                                            }

                                        }}>

                                        {/* Link icon and label, use helper function to determine if it should be highlighted as the current page */}
                                        <ListItemIcon className={
                                            text === "Sign Out" ?
                                                null
                                                : isHighlighted(location, text, open) ?
                                                    !open ? classes.highlighted : classes.moduleText
                                                    : classes.nonHighlighted}
                                        >
                                            {
                                                getIcon(text)
                                            }
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={text}
                                            className={
                                                text === "Sign Out" ?
                                                    null
                                                    : isHighlighted(location, text, open) ?
                                                        !open ? classes.highlighted : classes.moduleText
                                                        : classes.nonHighlighted
                                            }
                                        />

                                        {/* Render expand or close icon for the parent lists depending on if they are open */}
                                        {
                                            text === "Assets" ?
                                                openAssetCollapse ?
                                                    <ExpandLess />
                                                    : <ExpandMore />
                                                : null
                                        }

                                        {
                                            text === "Shipments" ?
                                                openShipmentCollapse ?
                                                    <ExpandLess />
                                                    : <ExpandMore />
                                                : null
                                        }
                                    </ListItem>

                                    {/* Render sublists */}
                                    {
                                        text === "Assets" ?
                                            <Collapse
                                                in={openAssetCollapse}
                                                timeout="auto"
                                                unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {
                                                        open ?
                                                            assetPages.map((item, idx) => {
                                                                return (
                                                                    <ListItem
                                                                        key={idx}
                                                                        button
                                                                        disableRipple
                                                                        style={{ paddingLeft: 32 }}
                                                                        onClick={() => {
                                                                            if (history) {
                                                                                if (item === "View All") {
                                                                                    history.push(getURL("View All Assets"))
                                                                                } else {
                                                                                    history.push(getURL(item));
                                                                                }
                                                                            }
                                                                        }}>

                                                                        <ListItemIcon
                                                                            className={
                                                                                isHighlighted(location, item === "View All" ? item + " Assets" : item, open) ?
                                                                                    classes.moduleText
                                                                                    : classes.nonHighlighted
                                                                            }>

                                                                            {
                                                                                getIcon(item)
                                                                            }

                                                                        </ListItemIcon>

                                                                        <ListItemText
                                                                            className={
                                                                                isHighlighted(location, item === "View All" ? item + " Assets" : item, open) ?
                                                                                    classes.moduleText
                                                                                    : classes.nonHighlighted
                                                                            }
                                                                            primary={item}
                                                                            primaryTypographyProps={{ variant: "body2" }} />
                                                                    </ListItem>
                                                                );
                                                            })
                                                            : null
                                                    }
                                                </List>
                                            </Collapse>

                                            : text === "Shipments" ?
                                                <Collapse
                                                    in={openShipmentCollapse}
                                                    timeout="auto"
                                                    unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {
                                                            open ?
                                                                shipmentPages.map((item, idx) => {
                                                                    return (
                                                                        <ListItem
                                                                            key={idx}
                                                                            button
                                                                            disableRipple
                                                                            style={{ paddingLeft: 32 }}
                                                                            onClick={() => {
                                                                                if (history) {
                                                                                    if (item === "View All") {
                                                                                        history.push(getURL("View All Shipments"))
                                                                                    } else {
                                                                                        history.push(getURL(item));
                                                                                    }
                                                                                }
                                                                            }}>

                                                                            <ListItemIcon
                                                                                className={
                                                                                    isHighlighted(location, item === "View All" ? item + " Shipments" : item, open)
                                                                                        ? classes.moduleText
                                                                                        : classes.nonHighlighted}>

                                                                                {
                                                                                    getIcon(item)
                                                                                }

                                                                            </ListItemIcon>

                                                                            <ListItemText
                                                                                className={
                                                                                    isHighlighted(location, item === "View All" ? item + " Shipments" : item, open)
                                                                                        ? classes.moduleText
                                                                                        : classes.nonHighlighted
                                                                                }
                                                                                primary={item}
                                                                                primaryTypographyProps={{ variant: "body2" }}
                                                                            />

                                                                        </ListItem>
                                                                    );
                                                                })
                                                                : null
                                                        }
                                                    </List>
                                                </Collapse>
                                                : null
                                    }
                                </React.Fragment>
                            )
                        })
                    }
                </List>
            </Drawer>
        </>
    )
};

Sidebar.propTypes = {
    location: PropTypes.any,
}

export default Sidebar;