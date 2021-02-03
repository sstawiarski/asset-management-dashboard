/*
 * Author: Shawn Stawiarski, Maija Kingston
 * October 2020
 * License: MIT
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
import WarningDialog from '../components/Dialogs/WarningDialog';

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
    const classes = useStyles();
    const history = useHistory();

    const [assets, setAssets] = useState([]);
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
    const [hasParents, setHasParents] = useState(false);
    const [haveParents, setHaveParents] = useState([]);
    const [url, setURL] = useState(`http://localhost:4000/assets?parentId=null&assetType=Asset`);

    useEffect(() => {
        if (history.location.state) {
            if (history.location.state.isAssemblyEdit) {
                getSchema(history.location.state.assemblyType, true).then(response => {
                    setSchema(response);
                    toggleAssembly(true);
                });

                fetch(`http://localhost:4000/assets?parentId=${history.location.state.serial}`)
                .then(res => res.json())
                .then(json => {
                    const existingItems = json.data.map(item => item.serial);
                    setCartItems(existingItems);
                });
            }
        }
    }, [history])

    //get assets from database that don't belong to an assembly
    useEffect(() => {
        if (assemblyStarted) {
            if (schema) {
                const assemblyType = encodeURI(schema.name);
                try {
                    setURL(`http://localhost:4000/assets?parentId=null&assetType=Asset&inAssembly=${assemblyType}${history.location.state.isAssemblyEdit ? "&isAssembly=true" : ""}`);
                } catch {
                    setURL(`http://localhost:4000/assets?parentId=null&assetType=Asset&inAssembly=${assemblyType}`);
                }
                
            }
        }
    }, [assemblyStarted, schema]);

    useEffect(() => {
        setURL(() => {
            let originalURL = `http://localhost:4000/assets?parentId=null&assetType=Asset`;
            if (schema) {
                const assemblyType = encodeURI(schema.name);
                try {
                    originalURL += `&inAssembly=${assemblyType}${history.location.state.isAssemblyEdit ? "&isAssembly=true" : ""}`;
                } catch {
                    originalURL += `&inAssembly=${assemblyType}`;
                }
            }

            Object.keys(filters).forEach(key => {
                originalURL += `&${key}=${filters[key]}`;
            })

            return originalURL;
        });
    }, [schema, filters]);

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

    useEffect(() => {
        setFilters(s => ({ ...s, page: 0 }));
    }, [activeFilters])

    const handleStart = () => {
        setCreatorOpen(true);
    }

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
        const badSerials = [];
        items.forEach(item => {
            const fullInfo = assets.find(asset => asset.serial === item);
            if (fullInfo.parentId) {
                badSerials.push(item);
            }
        });

        if (badSerials.length) {
            const onlyGood = items.filter(item => !badSerials.includes(item));
            setCartItems(orig => ([...orig, ...onlyGood]));
            setSelected([]);
            setHaveParents(badSerials);
            setHasParents(true);
            return;
        }

        setCartItems(orig => ([...orig, ...items]));
        setSelected([]);
    }

    const handleRemoveFromCart = (serial) => {
        const newCart = cartItems.filter(item => item !== serial);
        setCartItems(newCart);
        const newSelected = selected.filter(asset => newCart.includes(asset));
        setSelected(newSelected);
    };

    const handleSubmitCheck = () => {
        compareSchema(schema, cartItems).then(result => {
            setSubmission(s => ({
                ...s,
                type: schema["name"],
                assets: cartItems.reduce((arr, item, idx) => {
                    arr.push([item, moreInfo[idx]]);
                    return arr;
                }, []),
                owner: state.owner,
                groupTag: state.groupTag,
                serializationFormat: schema["serializationFormat"]
            }))
            if (!result[0]) {
                setMissingItems(result[1]);
                setSubmission(s => ({ ...s, missingItems: result[1] }))
                setIncomplete(true);
            } else {
                setSubmitOpen(true);
            }
        })
    };


    const handleSubmitCancel = () => {
        toggleOverride(false);
        setCreatorOpen(false);
        toggleAssembly(false);
        setSchema(null);
        setSubmitOpen(false);
        setAssets([]);
        setAssetCount(0);
        setIncomplete(false);
        setMissingItems([]);
        setMoreInfo([]);
        setSelected([]);
        setSubmission({});
        setCartItems([]);
        setState({});
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
                                clickable={QuickAssetView}
                                inactive="parentId">

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
                            onSubmit={handleSubmitCheck}
                        />

                        : null}


                </Grid>
            </Grid>

            <CreateNewAssemblyDialog
                creatorOpen={creatorOpen}
                handleCreate={handleCreate}
                handleCancel={handleCancel} />

            <AssetFilter
                open={filterOpen}
                setOpen={(isOpen) => setFilterOpen(isOpen)}
                setActiveFilters={setActiveFilters} />

            <AssemblySubmitDialog
                open={submitOpen}
                isComplete={!override}
                onSuccess={() => setSuccess(true)}
                onFailure={() => setSuccess(false)}
                handleCancel={handleSubmitCancel}
                submission={submission} />

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
                missingItems={missingItems} />

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
                items={haveParents} />


            <Snackbar open={success !== null} autoHideDuration={5000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ boxShadow: "1px 2px 6px #5f5f5f", borderRadius: "3px" }}>
                <Alert onClose={() => setSuccess(null)} severity={success ? "success" : "error"}>
                    {success ? "Assembly successfully created!" : "Failed to submit assembly..."}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default CreateAssembly;