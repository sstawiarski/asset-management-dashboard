/*
 * Author: Shawn Stawiarski, Maija Kingston
 * October 2020
 * License: MIT
 */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CustomTable from '../components/Tables/CustomTable'
import TableToolbar from '../components/Tables/TableToolbar';

import AssetFilter from '../components/Dialogs/AssetFilter'
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';

import CartTable from '../components/CartTable';
import Header from '../components/Header'
import ChipBar from '../components/Tables/ChipBar';
import CreateNewAssemblyDialog from '../components/Dialogs/CreateNewAssemblyDialog';
import AssemblySubmitDialog from '../components/Dialogs/AssemblySubmitDialog';
import IncompleteAssemblyDialog from '../components/Dialogs/IncompleteAssemblyDialog';
import QuickAssetView from '../components/Dialogs/QuickAssetView';

import { compareSchema, getSchema } from '../utils/assembly.utils';

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
        padding: theme.spacing(2)
    },
    break: {
        flexGrow: 1,
        fontWeight: "bold"
    },
    button: {
        color: "#3CB3E6"
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

const selectedFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];
const headCells = [{ label: "Serial" }];

const CreateAssembly = () => {

    const [assets, setAssets] = useState([]);
    const classes = useStyles();
    const [assemblyStarted, toggleAssembly] = useState(false);
    const [creatorOpen, setCreatorOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [schema, setSchema] = useState(null);

    const [assetCount, setAssetCount] = useState(0);
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [activeFilters, setActiveFilters] = useState({});

    const [selected, setSelected] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const [state, setState] = useState({});
    const [success, setSuccess] = useState(null);
    const [incomplete, setIncomplete] = useState(false);
    const [override, toggleOverride] = useState(false);
    const [missingItems, setMissingItems] = useState([]);

    const [submission, setSubmission] = useState({});

    const [moreInfo, setMoreInfo] = useState([]);

    //get assets from database that don't belong to an assembly
    useEffect(() => {
        const fetchAssets = async () => {
            //get assets from DB
            const result = await fetch(`http://localhost:4000/assets`);
            const json = await result.json();

            return (json);
        };

        fetchAssets()
            .then(result => {
                const array = result.map((element) => ({
                    serial: element.serial,
                    product: element.assetType,
                    description: element.assetName,
                    owner: element.owner,
                    groupTag: element.groupTag,
                    parentId: element.parentId
                }));
                //filter to get assets that aren't in an assembly
                setAssets(array.filter(asset => asset.parentId == null));
            });
    }, [])

    const handleStart = () => {
        setCreatorOpen(true);
    }

    const handleCreate = () => {
        getSchema(state.assemblyType).then(response => {
            setSchema(response);
        });
        setCreatorOpen(false);
        toggleAssembly(true);

    }

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

    const handleAddToCart = (items) => {
        setCartItems(orig => ([...orig, ...items]));
        setSelected([]);
    }

    const handleRemoveFromCart = (serial) => {
        const newCart = cartItems.filter(item => item !== serial);
        setCartItems(newCart);
        const newSelected = selected.filter(asset => newCart.includes(asset));
        setSelected(newSelected);
    };

    const handleAssemblySubmit = () => {
        compareSchema(schema, cartItems).then(result => {
            setSubmission(s => ({
                ...s,
                type: schema["name"],
                assets: cartItems.reduce((arr, item, idx) => {
                    arr.push([item, moreInfo[idx]]);
                    return arr;
                }, []),
                serial: "G800-11120"
            }))
            if (!result[0]) {
                setMissingItems(result[1]);
                setIncomplete(true);
            } else {
                setSubmitOpen(true);
            }
        })
    };

    const handleSuccess = () => {
        setSuccess(true);
    };

    const handleFailure = () => {
        setSuccess(false);
    };

    const handleClose = () => {
        setSuccess(null);
    }

    const handleSubmitCancel = () => {
        toggleOverride(false);
        setSubmitOpen(false);
    }

    //post request to submit selected assets as a new assembly
    const handleSubmitAssembly = async () => {
        try {
            let result = await fetch("http://localhost:4000/assets/create-Assembly", {
                method: 'post',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(cartItems)
            });
            console.log(result)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={classes.root}>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Header heading="Products" subheading="Assembly Creator" />
                </Grid>
                <Grid item xs={12} sm={12} md={assemblyStarted ? 8 : 12} lg={assemblyStarted ? 8 : 12}>

                    {
                        assemblyStarted
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
                                clickable={QuickAssetView}>

                                <TableToolbar title="Assembly Creator" selected={selected}>
                                    {selected.length > 0 ?
                                        <Tooltip title={"Add"}>
                                            <IconButton aria-label={"add"}>
                                                <AddIcon onClick={() => handleAddToCart(selected)} />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title={"Filter"}>
                                            <IconButton aria-label={"filter"}>
                                                <FilterListIcon onClick={() => setFilterOpen(true)} />
                                            </IconButton>
                                        </Tooltip>}
                                </TableToolbar>

                                <ChipBar
                                    activeFilters={activeFilters}
                                    setActiveFilters={setActiveFilters}
                                    setFilters={setFilters} />

                            </CustomTable>

                            : <Paper className={classes.paper}>
                                <Box m="auto">
                                    <Typography variant="body1" className={classes.item}>No Assembly In Progress</Typography>
                                    <div style={{ flexBasis: "100%", height: 0 }} />
                                    <Button className={classes.button} onClick={handleStart}>Create New Assembly</Button>
                                </Box>
                            </Paper>
                    }
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4}>

                    {assemblyStarted ?

                        <CartTable
                            header={headCells}
                            rows={cartItems}
                            handleRemove={handleRemoveFromCart}
                            onSubmit={handleSubmitAssembly}
                        />

                        : null}


                </Grid>
            </Grid>

            <CreateNewAssemblyDialog creatorOpen={creatorOpen} handleCreate={handleCreate} handleCancel={handleCancel} setParentState={setState} />
            <AssetFilter open={filterOpen} setOpen={(isOpen) => setFilterOpen(isOpen)} setActiveFilters={setActiveFilters} />
            <AssemblySubmitDialog
                open={submitOpen}
                setOpen={setSubmitOpen}
                isComplete={!override}
                onSuccess={handleSuccess}
                onFailure={handleFailure}
                handleCancel={handleSubmitCancel}
                submission={submission} />

            <IncompleteAssemblyDialog open={incomplete} setOpen={setIncomplete} handleOverride={() => { toggleOverride(true); setIncomplete(false); setSubmitOpen(true) }} missingItems={missingItems} />
            <Snackbar open={success !== null} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ boxShadow: "1px 2px 6px #5f5f5f", borderRadius: "3px" }}>
                <Alert onClose={handleClose} severity={success ? "success" : "error"}>
                    {success ? "Assembly successfully created!" : "Failed to submit assembly..."}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default CreateAssembly;