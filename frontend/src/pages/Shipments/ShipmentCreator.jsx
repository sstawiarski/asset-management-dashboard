import React, { useState, useEffect } from 'react';

//Library Tools
import { makeStyles } from '@material-ui/core/styles'
import uuid from 'react-uuid';

//Material-UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Fab from '@material-ui/core/Fab';

//Icons
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

//Dialogs
import AssetFilter from '../../components/Dialogs/AssetDialogs/AssetFilter'
import CreateNewShipmentDialog from '../../components/Dialogs/ShipmentDialogs/CreateNewShipmentDialog';
import ShipmentSubmitDialog from '../../components/Dialogs/ShipmentDialogs/ShipmentSubmitDialog';
import QuickAssetView from '../../components/Dialogs/AssetDialogs/QuickAssetView';
import WarningDialog from '../../components/Dialogs/GeneralDialogs/WarningDialog';
import AddUnserializedDialog from '../../components/Dialogs/AssetDialogs/AddUnserializedDialog';

//Custom Components
import Header from '../../components/General/Header'
import ChipBar from '../../components/Tables/ChipBar';
import CustomTable from '../../components/Tables/CustomTable'
import TableToolbar from '../../components/Tables/TableToolbar';
import Cart from '../../components/General/Cart';

const useStyles = makeStyles((theme) => ({
    root: {

    },
    paper: {
        marginLeft: "15px",
        marginRight: "15px",
        height: "75vh",
        display: "flex"
    },
    item: {
        padding: theme.spacing(2),
        marginTop: "10rem"
    },
    break: {
        flexGrow: 1,
        fontWeight: "bold"
    },
    puzzle: {
        color: theme.palette.secondary.light,
        fontSize: "5rem",
        opacity: "75%",
    },
    title: {
        marginLeft: "20px",
    },
    cartInactive: {
        backgroundColor: "#D9D9D9",
    },
    settingTitle: {
        padding: "0px 24px 16px 24px",
        color: "#000000",
        opacity: "0.58",
        fontWeight: "bold"
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: 180,
        maxWidth: 250
    },
    spacer: {
        padding: "6px 8px"
    },
    unserializedFab: {
        position: "fixed",
        bottom: theme.spacing(6),
        right: theme.spacing(15)
    },
    unserializedAddIcon: {
        marginRight: theme.spacing(1)
    }
}))

//fields to select for the particular type of document going into the table
const selectedFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];


const ShipmentCreator = () => {
    const classes = useStyles();

    /* Data state */
    const [state, setState] = useState({}); //main info about shipment, locations, etc
    const [assets, setAssets] = useState([]); //results list
    const [selected, setSelected] = useState([]);
    const [mapItems, setMapItems] = useState([]);
    const [assetCount, setAssetCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [success, setSuccess] = useState(null);
    const [submission, setSubmission] = useState({});
    const [hasParents, setHasParents] = useState(false);
    const [haveParents, setHaveParents] = useState([]);
    const [cartBadge, setCartBadge] = useState("badge");

    /* Dialog state */
    const [shipmentStarted, toggleShipment] = useState(false);
    const [creatorOpen, setCreatorOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [unserializedOpen, setUnserializedOpen] = useState(false);
    const [abandoned, setAbandoned] = useState(false);

    /* Filter state */
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [activeFilters, setActiveFilters] = useState({});
    const originalURL = `${process.env.REACT_APP_API_URL}/assets`;
    const [url, setURL] = useState(originalURL);


    /* Set url with supplied filters */
    useEffect(() => {
        setURL(() => {
            let newURL = originalURL;
            let index = 0;

            Object.keys(filters).forEach((key, idx) => {
                let concatenator = index === 0 ? "?" : "&";
                newURL += `${concatenator}${key}=${filters[key]}`;
                index++;
            });

            return newURL;
        });
    }, [filters, originalURL, shipmentStarted]);

    /* Fetch shipment list */
    useEffect(() => {
        fetch(url)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    if (response.status >= 300) {

                        return {
                            count: [{ count: 0 }],
                            data: []
                        }
                    } else {
                        return null;
                    }

                }
            })
            .then(json => {
                if (json) {
                    setAssetCount(json.count[0].count);
                    setAssets(json.data);
                }
            });
    }, [url]);

    /* Reset page of table to the first when filters are changed */
    useEffect(() => {
        setFilters(s => ({ ...s, page: 0 }));
    }, [activeFilters]);

    useEffect(() => {
        setCartBadge("badge badge-reload");
        setCartBadge("badge");
    }, [cartItems]);

    /* Initial blank page button handler to open creator dialog */
    const handleStart = () => {
        setCreatorOpen(true);
    }

    /* Set information from creator dialog upon submission */
    const handleCreate = (childState) => {
        if(childState.shipFrom==null || childState.shipTo==null || childState.shipmentType==null){
            console.log('all fields must be filled.')
        }else{
            setState(s => ({
                ...s,
                shipFrom: {
                    id: childState.shipFrom["_id"],
                    key: childState.shipFrom["key"],
                    name: childState.shipFrom["locationName"]
                },
                shipTo: {
                    id: childState.shipTo["_id"],
                    key: childState.shipTo["key"],
                    name: childState.shipTo["locationName"]
                },
                shipmentType: childState.shipmentType
            }));
            setCreatorOpen(false);
            toggleShipment(true);
        }
    }

    /* Handle cancel button on creator dialog */
    const handleCancel = () => {
        setCreatorOpen(false);
        toggleShipment(false);

        setState(s => {
            Object.keys(s).forEach(key => {
                if (s[key] instanceof Array) {
                    s[key] = [];
                } else {
                    s[key] = "";
                }
            })
            return (s);
        })
    }

    /* Check if selected items already have parent assemblies or are deployed elsewhere and then add to cart */
    const handleAddToCart = () => {
        const badSerials = [];

        const newAdditions = []

        mapItems.forEach(item => {

            const isDeployed = item.deployedLocation && (state.shipFrom["key"] && item.deployedLocation["key"] !== state.shipFrom["key"]);
            const hasParent = Boolean(item.parentId);
            const isCheckedOut = Boolean(item.checkedOut);

            const warning = {
                serial: item.serial,
                name: item.assetName
            };

            /* Generate 'problem' descriptor elements for the warning/override dialog */
            const problems = []
            if (isDeployed) {
                problems.push(
                    <React.Fragment key={uuid()}>
                        <span>Deployed at non-matching location {item.deployedLocation["key"]} (selected location: {state.shipFrom["key"]})</span>
                        <br />
                    </React.Fragment>
                );
            }

            if (hasParent) {
                problems.push(
                    <React.Fragment key={uuid()}>
                        <span>Asset is a child of assembly {item.parentId}</span>
                        <br />
                    </React.Fragment>
                );
            }

            if (isCheckedOut) {
                problems.push(
                    <React.Fragment key={uuid()}>
                        <span>Asset is already checked out</span>
                        <br />
                    </React.Fragment>
                );
            }

            if (problems.length) {
                warning["problem"] = <div>{problems}</div>
                badSerials.push(warning);
            }

            /* If no warning, just add it to the items to be added to the cart */
            if (!isDeployed && !hasParent && !isCheckedOut) {
                newAdditions.push({
                    serial: item.serial,
                    name: item.assetName
                });
            }
        });

        //add the good serials to the cart and trigger warning dialog for the serials with parents
        if (badSerials.length) {
            setCartItems(orig => ([...orig, ...newAdditions]));
            setSelected([]);
            setMapItems([]);
            setHaveParents(badSerials);
            setHasParents(true);
            return;
        }

        //set the cart items if no bad serials are found
        setCartItems(orig => [...orig, ...newAdditions]);
        setSelected([]);
        setMapItems([]);
    }

    /** 
     * Sets the submission information and opens the submit dialog
     */
    const handleSubmitCheck = () => {
        if(state.shipFrom==null || state.shipTo==null){
            console.log("fill out all forms")
            alert("All fields must be filled");
        }else{
            setSubmission(s => ({
                ...s,
                shipmentType: state.shipmentType,
                shipFrom: state.shipFrom,
                shipTo: state.shipTo,
                assets: cartItems.map(item => ({
                    serial: item.serial,
                    name: item.name ? item.name : item.assetName,
                    quantity: item.quantity ? item.quantity : 1,
                    notes: item.notes ? item.notes : null,
                    serialized: item.serial !== "N/A" ? true : false
                })),
                override: state.override || false
            }));

            setAnchorEl(null);
            setSubmitOpen(true);
    }

    };


    /* Handles the cancel button from the Submit Assembly dialog but leave all selections and cart items in place for editing */
    const handleSubmitCancel = () => {
        setSubmitOpen(false);
    };

    /* Remove all state when shipment is abandoned */
    const handleAbandon = () => {
        setCreatorOpen(false);
        toggleShipment(false);
        setSubmitOpen(false);
        setAssets([]);
        setAssetCount(0);
        setSelected([]);
        setMapItems([]);
        setSubmission({});
        setCartItems([]);
        setState({});
        setActiveFilters({});
        setFilters({ limit: 5 });
        setAbandoned(false);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <Header heading="Shipments" subheading="Shipment Creator" />
                </Grid>

                <Grid item xs={12}>
                    {/* Render placeholder box if shipment is not started or the actual results table if it is */}
                    {
                        shipmentStarted
                            ?
                            <>
                                <CustomTable
                                    variant="asset"
                                    data={assets}
                                    selectedFields={selectedFields}
                                    selected={selected}
                                    filters={filters}
                                    count={assetCount}
                                    checkboxes

                                    renderOnClick={QuickAssetView}
                                    onFilterChange={(newFilters) => setFilters(s => ({ ...s, ...newFilters }))}
                                    onValidate={(asset) => {
                                        const warnings = [];
                                        const errors = [];

                                        if (asset.parentId) warnings.push(`Asset is a part of assembly ${asset.parentId}`);
                                        if (asset.deployedLocation) {
                                            if (state["shipFrom"] && state["shipFrom"].key !== asset.deployedLocation["key"]) {
                                                warnings.push(<span>Asset is deployed at a non-matching location ({asset.deployedLocation["key"]})</span>);
                                            }
                                        }
                                        if (asset.checkedOut) {
                                            warnings.push("Asset is marked as being checked out");
                                        }

                                        return { warnings: warnings, errors: errors };
                                    }}
                                    onAdditionalSelect={setMapItems}
                                    onCompare={(item) => {
                                        const isItselfInCart = cartItems.find(cartItem => cartItem[selectedFields[0]] === item[selectedFields[0]])
                                        const isParentInCart = cartItems.find(cartItem => cartItem[selectedFields[0]] === item?.parentId);

                                        /* Remove children already in cart if their parent is added */
                                        if (isItselfInCart && isParentInCart) {
                                            setCartItems(c => c.filter(cartItem => cartItem[selectedFields[0]] !== item[selectedFields[0]]))
                                        }
                                        return [(isItselfInCart || isParentInCart), isParentInCart]
                                    }
                                    }
                                    onSelectedChange={setSelected}>

                                    <TableToolbar title="Shipment Creator" selected={selected}>
                                        {
                                            selected.length > 0 ?
                                                <Tooltip title={"Add"}>
                                                    <IconButton aria-label={"add"} onClick={handleAddToCart}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                :
                                                <Tooltip title={"Filter"}>
                                                    <IconButton aria-label={"filter"} onClick={() => setFilterOpen(true)}>
                                                        <FilterListIcon />
                                                    </IconButton>
                                                </Tooltip>
                                        }
                                    </TableToolbar>

                                    <ChipBar
                                        activeFilters={activeFilters}
                                        setActiveFilters={setActiveFilters}
                                        setFilters={setFilters} />

                                </CustomTable>
                                <Button style={{ color: "red", float: "left", marginLeft: "20px" }} variant="text" onClick={() => setAbandoned(true)}>Abandon</Button>
                            </>
                            : <Paper className={classes.paper}>
                                <Box m="auto">
                                    <LocalShippingIcon className={classes.puzzle} />
                                    <Typography variant="h5">Welcome to the Shipment Creator!</Typography>
                                    <Typography variant="h6" className={classes.item}>No Shipment In Progress</Typography>
                                    <div style={{ flexBasis: "100%", height: "5rem" }} />
                                    <Button color="primary" variant="contained" onClick={handleStart}>Start Shipment</Button>
                                </Box>
                            </Paper>
                    }
                </Grid>
            </Grid>

            {/* Shipment cart */}
            <Cart
                cartItems={cartItems}
                headers={["Serial", "Name", "Quantity"]}
                onSubmit={handleSubmitCheck}
                onRemove={(idObj) => {
                    const [key, value] = Object.entries(idObj)[0];
                    setCartItems(s => s.filter(item => item[key] !== value));
                }}
                onClickAway={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                onNoteUpdate={(idObj) => {
                    const index = cartItems.findIndex(item => item[idObj.idKey] === idObj[idObj.idKey]);
                    let newCart = [...cartItems];
                    if (idObj.notes === "" && newCart[index].notes) delete newCart[index].notes;
                    else newCart[index].notes = idObj.notes;
                    setCartItems(newCart);
                }}
                onClear={() => setCartItems([])}
                notes
                placement="top" />

            {/* Dialogs */}
            <CreateNewShipmentDialog
                creatorOpen={creatorOpen}
                handleCreate={handleCreate}
                handleCancel={handleCancel}
            />

            <AssetFilter
                open={filterOpen}
                setOpen={(isOpen) => setFilterOpen(isOpen)}
                setActiveFilters={setActiveFilters}
                assetList={null}
            />

            <AddUnserializedDialog
                open={unserializedOpen}
                onClose={() => setUnserializedOpen(false)}
                onSubmit={(obj) => {
                    setCartItems(s => [...s, obj]);
                    setUnserializedOpen(false);
                }} />

            <ShipmentSubmitDialog
                open={submitOpen}
                onSuccess={() => setSuccess(true)}
                onFailure={() => setSuccess(false)}
                handleCancel={handleSubmitCancel}
                submission={submission}
            />


            <WarningDialog
                open={hasParents}
                setOpen={setHasParents}
                handleOverride={() => {
                    const items = haveParents.map(item => ({ name: item.name, serial: item.serial }));
                    setCartItems(c => [...c, ...items]);
                    setHasParents(false);
                    setHaveParents([]);
                    setState(s => ({ ...s, override: true }));
                }}
                text={
                    <div style={{ textAlign: "center" }}>
                        <span>Some selected assets have problems <br /> <br /></span>
                        <span>Overriding this warning will force-update the assets upon shipment submission</span>
                    </div>
                }
                title="Warning"
                items={haveParents.map(item => [item.serial, item.name, item.problem])}
                headers={["Serial", "Name", "Problem"]}
            />

            <WarningDialog
                open={abandoned}
                setOpen={setAbandoned}
                handleOverride={handleAbandon}
                text="Abandoning this shipment will erase all current modifications"
                title="Abandon Shipment?"
                items={null}
            />


            {/* Success or failure feedback upon shipment submission */}
            {/* Resets all creator state upon success or leave intact for another try if the shipment fails to submit */}
            <Snackbar
                open={success !== null}
                onEnter={() => success ? toggleShipment(false) : {}}
                autoHideDuration={5000}
                onClose={() => {
                    if (success) {
                        setSuccess(null);
                        handleAbandon();
                        return;
                    }
                    setSuccess(null);
                }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                style={{
                    boxShadow: "1px 2px 6px #5f5f5f",
                    borderRadius: "3px"
                }}>

                {
                    success !== null ?
                        <Alert onClose={() => setSuccess(null)} severity={success ? "success" : "error"}>
                            {success === true ? "Shipment successfully created!" : "Failed to submit shipment..."}
                        </Alert>
                        : null
                }
            </Snackbar>

            {/* Floating action buttons for the shipment cart and the unserialized item creator */}
            {
                shipmentStarted ?
                    <>
                        <Fab
                            className={classes.unserializedFab}
                            color="secondary"
                            aria-label="add unserialized component"
                            variant="extended"
                            onClick={() => setUnserializedOpen(true)}>

                            <AddIcon className={classes.unserializedAddIcon} />
                            <span>Add Unserialized Item</span>
                        </Fab>

                        <div className={cartBadge} value={cartItems.length}>
                            <Fab
                                color="primary"
                                onClick={(event) => setAnchorEl(event.target)}>
                                <ShoppingCartIcon />
                            </Fab>
                        </div>

                    </>
                    : null
            }

        </div>
    );
}

export default ShipmentCreator;