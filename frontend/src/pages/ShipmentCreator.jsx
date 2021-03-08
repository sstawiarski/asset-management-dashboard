import React, { useState, useEffect } from 'react';

//Library Tools
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

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
import AssetFilter from '../components/Dialogs/AssetFilter'
import CreateNewShipmentDialog from '../components/Dialogs/CreateNewShipmentDialog';
import ShipmentSubmitDialog from '../components/Dialogs/ShipmentSubmitDialog';
import QuickAssetView from '../components/Dialogs/QuickAssetView';
import WarningDialog from '../components/Dialogs/WarningDialog';
import AddUnserializedDialog from '../components/Dialogs/AddUnserializedDialog';

//Custom Components
import Header from '../components/Header'
import ChipBar from '../components/Tables/ChipBar';
import CustomTable from '../components/Tables/CustomTable'
import TableToolbar from '../components/Tables/TableToolbar';
import NewCart from '../components/NewCart';

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
        position: "absolute",
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
    const history = useHistory();

    /* Data state */
    const [state, setState] = useState({}); //main info about assembly, owner, etc
    const [assets, setAssets] = useState([]); //results list
    const [selected, setSelected] = useState([]);
    const [mapItems, setMapItems] = useState([]);
    const [assetCount, setAssetCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [success, setSuccess] = useState(null);
    const [override, toggleOverride] = useState(false);
    const [submission, setSubmission] = useState({});
    const [moreInfo, setMoreInfo] = useState([]);
    const [hasParents, setHasParents] = useState(false);
    const [haveParents, setHaveParents] = useState([]);

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
    const originalURL = `http://localhost:4000/assets`;
    const [url, setURL] = useState(originalURL);


    /* Set url with supplied filters */
    useEffect(() => {
        if (shipmentStarted) {
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
        }
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
    }, [activeFilters])

    /* Initial blank page button handler to open creator dialog */
    const handleStart = () => {
        setCreatorOpen(true);
    }

    /* Set information from creator dialog upon submission */
    const handleCreate = (childState) => {

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

    /* Check if selected items already have parent assemblies and then add to cart */
    const handleAddToCart = () => {
        const badSerials = [];

        const newAdditions = mapItems.map(item => {
            return {
                serial: item.serial,
                name: item.assetName
            }
        });

        setCartItems(orig => [...orig, ...newAdditions]);
        setSelected([]);
        setMapItems([]);

        /*
         
        //check for existing parents
        items.forEach(item => {
            const fullInfo = assets.find(asset => asset.serial === item);
            if (fullInfo.parentId) {
                badSerials.push(item);
            }
        });

        //add the good serials to the cart and trigger warning dialog for the serials with parents
        if (badSerials.length) {
            const onlyGood = items.filter(item => !badSerials.includes(item));
            setCartItems(orig => ([...orig, ...onlyGood]));
            setSelected([]);
            setHaveParents(badSerials);
            setHasParents(true);
            return;
        }

        //set the cart items if no bad serials are found
        setCartItems(orig => ([...orig, ...items]));
        setSelected([]);
        */
    }

    /** 
     * Compares schema saved in state from the helper tool with the assets currently in cart
     * 
     * Sets the submission information depending on whether assembly is being modified or created for the first time
     */
    const handleSubmitCheck = () => {

        setSubmission(s => ({
            ...s,
            shipmentType: state.shipmentType,
            shipFrom: state.shipFrom,
            shipTo: state.shipTo,
            assets: cartItems.map(item => ({
                serial: item.serial,
                name: item.name ? item.name : item.assetName,
                quantity: item.quantity ? item.quantity : undefined,
                notes: item.notes ? item.notes : null
            }))
        }));

        setAnchorEl(null);
        setSubmitOpen(true);

    };


    /* Handles the cancel button from the Submit Assembly dialog but leave all selections and cart items in place for editing */
    const handleSubmitCancel = () => {
        toggleOverride(false);
        setSubmitOpen(false);
        //setIncomplete(false);
    };

    /* Remove all state when assembly is abandoned */
    const handleAbandon = () => {
        toggleOverride(false);
        setCreatorOpen(false);
        toggleShipment(false);
        //setSchema(null);
        setSubmitOpen(false);
        setAssets([]);
        setAssetCount(0);
        //setIncomplete(false);
        //setMissingItems([]);
        setMoreInfo([]);
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
                    {/* Render placeholder box if assembly is not started or the actual results table if it is */}
                    {
                        shipmentStarted
                            ? <CustomTable
                                data={assets}
                                selectedFields={selectedFields}
                                selected={selected}
                                setSelected={setSelected}
                                filters={filters}
                                setFilters={setFilters}
                                count={assetCount}
                                variant="asset"
                                checkboxes={true}
                                compare={cartItems}
                                moreInfo={moreInfo}
                                setMoreInfo={setMoreInfo}
                                lookup="assetName"
                                clickable={QuickAssetView}
                                setMapItems={setMapItems}
                                inactive="parentId"
                                returnsObject>

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

            <NewCart
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
                    setCartItems(c => [...c, ...haveParents]);
                    setHasParents(false);
                    setHaveParents([]);
                }}
                text="Some assets already have parent assemblies; adding them will remove them from their previous parent."
                title="Asset Update Warning"
                items={haveParents}
            />

            <WarningDialog
                open={abandoned}
                setOpen={setAbandoned}
                handleOverride={handleAbandon}
                text="Abandoning this assembly will erase all current modifications"
                title="Abandon Assembly?"
                items={null}
            />


            {/* Success or failure feedback upon assembly submission */}
            {/* Resets all creator state upon success or leave intact for another try if the assembly fails to submit */}
            <Snackbar
                open={success !== null}
                onEnter={() => toggleShipment(false)}
                autoHideDuration={5000}
                onClose={() => {
                    if (success) {
                        setSuccess(null)
                        handleAbandon();
                    }
                    setSuccess(null)
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                style={{ boxShadow: "1px 2px 6px #5f5f5f", borderRadius: "3px" }}>
                {
                    success !== null ?
                        <Alert onClose={() => setSuccess(null)} severity={success ? "success" : "error"}>
                            {success === true ? "Assembly successfully created or modified!" : "Failed to submit assembly..."}
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

                        <div className="badge" value={cartItems.length}>
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