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
import ExtensionIcon from '@material-ui/icons/Extension';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

//Dialogs
import AssetFilter from '../../components/Dialogs/AssetDialogs/AssetFilter'
import CreateNewAssemblyDialog from '../../components/Dialogs/AssetDialogs/CreateNewAssemblyDialog';
import AssemblySubmitDialog from '../../components/Dialogs/AssetDialogs/AssemblySubmitDialog';
import IncompleteAssemblyDialog from '../../components/Dialogs/AssetDialogs/IncompleteAssemblyDialog';
import QuickAssetView from '../../components/Dialogs/AssetDialogs/QuickAssetView';
import WarningDialog from '../../components/Dialogs/GeneralDialogs/WarningDialog';

//Custom Components
import Header from '../../components/General/Header'
import ChipBar from '../../components/Tables/ChipBar';
import CustomTable from '../../components/Tables/CustomTable'
import TableToolbar from '../../components/Tables/TableToolbar';
import Cart from '../../components/General/Cart';

//Tools
import { compareSchema, getSchema } from '../../utils/assembly.utils';

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
    }
}))

//fields to select for the particular type of document going into the table
const selectedFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];

const AssemblyManager = () => {
    const classes = useStyles();
    const history = useHistory();

    /* Data state */
    const [state, setState] = useState({}); //main info about assembly, owner, etc
    const [assets, setAssets] = useState([]); //results list
    const [selected, setSelected] = useState([]);
    const [mapItems, setMapItems] = useState([]);
    const [schema, setSchema] = useState(null);
    const [assetCount, setAssetCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [success, setSuccess] = useState(null);
    const [incomplete, setIncomplete] = useState(false);
    const [override, toggleOverride] = useState(false);
    const [missingItems, setMissingItems] = useState([]);
    const [submission, setSubmission] = useState({});
    const [hasParents, setHasParents] = useState(false);
    const [haveParents, setHaveParents] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    /* Dialog state */
    const [assemblyStarted, toggleAssembly] = useState(false);
    const [creatorOpen, setCreatorOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [abandoned, setAbandoned] = useState(false);

    /* Filter state */
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [activeFilters, setActiveFilters] = useState({});
    const [url, setURL] = useState(`${process.env.REACT_APP_API_URL}/assets?assetType=Asset`);

    /* Initial setup if existing assembly is being modified */
    useEffect(() => {
        if (history.location.state) {
            if (history.location.state.isAssemblyEdit) {
                getSchema(history.location.state.assemblyType, true).then(response => {
                    setSchema(response);
                    toggleAssembly(true);
                    setURL(`${process.env.REACT_APP_API_URL}/assets?assetType=Asset&inAssembly=${response.name}`);
                });

                fetch(`${process.env.REACT_APP_API_URL}/assets?parentId=${history.location.state.serial}`)
                    .then(res => res.json())
                    .then(json => {
                        const existingItems = json.data.map(item => ({ serial: item.serial, name: item.assetName }));
                        setCartItems(existingItems);
                    });
            }
        }
    }, [history.location.state]);

    /* get assets from database that don't belong to an assembly */
    useEffect(() => {
        if (schema && !history.location.state) {
            const assemblyType = encodeURI(schema.name);
            setURL(`${process.env.REACT_APP_API_URL}/assets?assetType=Asset&inAssembly=${assemblyType}`);
        }
    }, [schema, history.location.state]);

    /* Set url with applied filters */
    useEffect(() => {
        setURL(u => {
            let originalURL = `${process.env.REACT_APP_API_URL}/assets?assetType=Asset`;
            const splitUpURL = JSON.parse('{"' + decodeURI(u).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
            const necessaryParts = Object.keys(splitUpURL)
                .filter(item => ["inAssembly", "isAssembly"].includes(item))
                .reduce((p, c) => {
                    p[c] = splitUpURL[c];
                    return p;
                }, {});

            Object.keys(filters).forEach(key => {
                originalURL += `&${key}=${filters[key]}`;
            });

            Object.keys(necessaryParts).forEach(key => {
                originalURL += `&${key}=${necessaryParts[key]}`;
            });

            return originalURL;
        });
    }, [filters]);

    /* Fetch asset list */
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
            ...childState
        }));
        getSchema(childState.assemblyType, true).then(response => {
            setSchema(response);
            setCreatorOpen(false);
            toggleAssembly(true);
        });

    }

    /* Handle cancel button on creator dialog */
    const handleCancel = () => {
        setCreatorOpen(false);
        toggleAssembly(false);
        setSchema(null);
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
        const newItems = [];

        //check for existing parents
        mapItems.forEach(item => {
            if (item.parentId) {
                badSerials.push({
                    serial: item.serial,
                    name: item.assetName,
                    problem: `Child of assembly ${item.parentId}`
                });
            } else {
                newItems.push({ serial: item.serial, name: item.assetName });
            }
        });

        //add the good serials to the cart and trigger warning dialog for the serials with parents
        if (badSerials.length) {
            setCartItems(orig => ([...orig, ...newItems]));
            setSelected([]);
            setMapItems([]);
            setHaveParents(badSerials);
            setHasParents(true);
            return;
        }

        //set the cart items if no bad serials are found
        setCartItems(orig => ([...orig, ...newItems]));
        setSelected([]);
        setMapItems([]);
    }
    /** 
     * Compares schema saved in state from the helper tool with the assets currently in cart
     * 
     * Sets the submission information depending on whether assembly is being modified or created for the first time
     */
    const handleSubmitCheck = () => {
        compareSchema(schema, cartItems).then(result => {

            let serialForReassembly = null;
            let reassembling = false;
            try {
                if (history.location.state.isAssemblyEdit) {
                    serialForReassembly = history.location.state.serial;
                    reassembling = true;
                }
            } catch { }

            setSubmission(s => ({
                ...s,
                type: schema["name"],
                assets: cartItems.map((item) => [item.serial, item.name]),
                owner: state.owner,
                groupTag: state.groupTag,
                serializationFormat: schema["serializationFormat"],
                serial: serialForReassembly,
                reassembling: reassembling,
                missingItems: []
            }));

            //if schema check failed then set the missing items and change state to open warning dialog
            if (result[0] === false) {
                setMissingItems(result[1]);
                setSubmission(s => ({ ...s, missingItems: result[1] }))
                setIncomplete(true);
            } else {
                setSubmitOpen(true);
            }
        })
    };


    /* Handles the cancel button from the Submit Assembly dialog but leave all selections and cart items in place for editing */
    const handleSubmitCancel = () => {
        toggleOverride(false);
        setSubmitOpen(false);
        setIncomplete(false);
    };

    /* Remove all state when assembly is abandoned */
    const handleAbandon = () => {
        toggleOverride(false);
        setCreatorOpen(false);
        toggleAssembly(false);
        setSchema(null);
        setSubmitOpen(false);
        setAssets([]);
        setAssetCount(0);
        setIncomplete(false);
        setMissingItems([]);
        setSelected([]);
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
                    <Header heading="Assets" subheading="Assembly Manager" />
                </Grid>

                <Grid item xs={12}>
                    {/* Render placeholder box if assembly is not started or the actual results table if it is */}
                    {
                        assemblyStarted
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
                                    onAdditionalSelect={setMapItems}
                                    onValidate={(asset) => {
                                        const warnings = [];
                                        const errors = [];
                                        if (asset.parentId && (asset.parentId !== history.location.state?.serial || !history.location.state?.serial )) warnings.push(`Asset is a part of assembly ${asset.parentId}`);
                                        return { warnings: warnings, errors: errors }
                                    }}
                                    onCompare={(item) => cartItems.find(cartItem => cartItem[selectedFields[0]] === item[selectedFields[0]]) !== undefined}
                                    onSelectedChange={setSelected}>

                                    <TableToolbar title="Assembly Creator" selected={selected}>
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
                                    <ExtensionIcon className={classes.puzzle} />
                                    <Typography variant="h5">Welcome to the Assembly Manager!</Typography>
                                    <Typography variant="h6" className={classes.item}>No Assembly In Progress</Typography>
                                    <div style={{ flexBasis: "100%", height: "5rem" }} />
                                    <Button color="primary" variant="contained" onClick={handleStart}>Start Assembly</Button>
                                </Box>
                            </Paper>
                    }
                </Grid>
            </Grid>

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
                onClear={() => setCartItems([])}
                placement="top"
            />

            <CreateNewAssemblyDialog
                creatorOpen={creatorOpen}
                handleCreate={handleCreate}
                handleCancel={handleCancel}
            />

            <AssetFilter
                open={filterOpen}
                setOpen={(isOpen) => setFilterOpen(isOpen)}
                setActiveFilters={setActiveFilters}
                assetList={schema ? schema["name"] : null}
            />

            <AssemblySubmitDialog
                open={submitOpen}
                isComplete={!override}
                onSuccess={() => setSuccess(true)}
                onFailure={() => setSuccess(false)}
                handleCancel={handleSubmitCancel}
                submission={submission}
            />

            <IncompleteAssemblyDialog
                open={incomplete}
                setOpen={setIncomplete}
                handleOverride={() => {
                    toggleOverride(true);
                    setSubmission(s => ({
                        ...s,
                        override: true
                    }))
                    setIncomplete(false);
                    setSubmitOpen(true);
                }
                }
                missingItems={missingItems}
            />

            <WarningDialog
                open={hasParents}
                setOpen={setHasParents}
                handleOverride={() => {
                    const items = haveParents.map(item => ({ name: item.name, serial: item.serial }));
                    setCartItems(c => [...c, ...items]);
                    setHasParents(false);
                    setHaveParents([]);
                }}
                text={
                    <div style={{ textAlign: "center" }}>
                        <span>Some selected assets have existing parents! <br /></span>
                        <span style={{ fontSize: "16px" }}>Overriding this warning will disassemble the parents and force-remove the assets upon submission<br /></span>
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
                text="Abandoning this assembly will erase all current modifications"
                title="Abandon Assembly?"
                items={null}
            />


            {/* Success or failure feedback upon assembly submission */}
            {/* Resets all creator state upon success or leave intact for another try if the assembly fails to submit */}
            <Snackbar
                open={success !== null}
                onEnter={() => toggleAssembly(false)}
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

            {/* Button for the cart */}
            {
                assemblyStarted ?
                    <div className="badge" value={cartItems.length}>
                        <Fab
                            color="primary"
                            onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)}
                            disableRipple>
                            <ShoppingCartIcon style={{ fontSize: "35px" }} />
                        </Fab>
                    </div>
                    : null
            }

        </div>
    );
}

export default AssemblyManager;