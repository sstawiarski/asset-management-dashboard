import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

//Internal Components
import Header from '../../components/General/Header'
import CustomTable from '../../components/Tables/CustomTable'
import TableToolbar from '../../components/Tables/TableToolbar';
import ChipBar from '../../components/Tables/ChipBar';
import SimpleMap from '../../components/General/Map';
import TableSearchbar from '../../components/Tables/TableSearchbar';

//Dialogs
import AssetFilter from '../../components/Dialogs/AssetDialogs/AssetFilter'
import RetireAssetDialog from '../../components/Dialogs/AssetDialogs/RetireAssetDialog';
import ChangeGroupTagDialog from '../../components/Dialogs/AssetDialogs/ChangeGroupTagDialog';
import ChangeAssignmentDialog from '../../components/Dialogs/AssetDialogs/ChangeAssignmentDialog';
import ChangeOwnershipDialog from '../../components/Dialogs/AssetDialogs/ChangeOwnershipDialog';
import ChangeAssignmentTypeDialog from '../../components/Dialogs/AssetDialogs/AssignmentTypeDialog';
import AssetEditWarning from '../../components/Dialogs/AssetDialogs/AssetEditWarning';
import CreateAssetDialog from '../../components/Dialogs/AssetDialogs/CreateAssetDialog';
import InvalidSerialsDialog from '../../components/Dialogs/AssetDialogs/InvalidSerialsDialog'

//Material-UI Imports
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

//Icons
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import MapIcon from '@material-ui/icons/Map';
import ListAltIcon from '@material-ui/icons/ListAlt';

//the object fields to get for the table we need, in this case assets
const selectedFields = ["serial", "assetName", 'deployedLocation', "assetType", "owner", "checkedOut", "groupTag"];

const useStyles = makeStyles({
    enabled: {
        color: "black"
    },
    disabled: {
        color: "rgba(0,0,0, 0.26) !important"
    }
});

const AllAssets = () => {
    const classes = useStyles();

    const [assets, setAssets] = useState([]);
    const [childAssets, setChildAssets] = useState([]);
    const [parentAssemblies, setParentAssemblies] = useState([]);
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [dialogs, setDialogs] = useState({});
    const [selected, setSelected] = useState([]);
    const [invalidSerial, setInvalid] = useState([]);
    const [assetCount, setAssetCount] = useState(0);
    const [activeFilters, setActiveFilters] = useState({});
    const [anchor, setAnchor] = useState(null);
    const [nextDialog, setNext] = useState("");
    const [override, setOverride] = useState(false);
    const [success, setSuccess] = useState({ succeeded: null, message: '' });
    const [map, toggleMap] = useState(false);
    const [assetMarkers, setAssetMarkers] = useState([]); //stores the whole document for each selected row, for mapping
    const [filteredMarkers, setFilteredMarkers] = useState(null);
    const [storedAssets, setStoredAssets] = useState(null);
    const [search, setSearch] = useState("");

    /* Handles searchbar when enter key is pressed */
    const handleKeyDown = (e) => {
        const value = e.target.value;
        if (e.key === 'Enter') {
            setFilters(s => ({ ...s, search: value }))
        }
    }

    /* Handle floating menu placement for toolbar */
    const handleClick = (event) => {
        setAnchor(event.currentTarget);
    }

    /* Close menu */
    const handleClose = () => {
        setAnchor(null);
    }

    /* Check selected items for existing parent */
    const handleMenuClick = (event) => {
        setAnchor(null);
        const children = [];
        const parents = [];
        setNext(event.target.getAttribute("name"));

        assetMarkers.forEach((item, idx) => {
            alert(JSON.stringify(item))
            if (item.assetType === "Assembly") {
                parents.push(item.serial);
                return;
            }
            if (!item.parentId) return;
            if (!selected.includes(item.parentId)) {
                children.push(selected[idx]);
            }
        });

        setParentAssemblies(parents);
        setChildAssets(children);

        /*
        Promise.all(
            selected.map(serial =>
                fetch(`${process.env.REACT_APP_API_URL}/assets/${serial}?project=parentId`)
                    .then(resp => {
                        if (resp.status < 300) {
                            return resp.json()
                        }
                        return null;
                    })
            )
        ).then(jsons => {
            jsons.forEach((item, idx) => {
                if (item) {
                    if (!item.parentId) return;
                    if (!selected.includes(item.parentId)) {
                        children.push(selected[idx]);
                    }
                }
                return;
            })
            setChildAssets(children);
        });
        */

    }

    /* Successful edit event */
    const onSuccess = (succeeded, message) => {
        if (succeeded) {
            setSelected([]);
            setSuccess({ succeeded: succeeded, message: message });
            setActiveFilters({ ...activeFilters });
        } else {
            setSuccess({ succeeded: succeeded, message: message });
        }
    };

    /**
     * Used for asset creator
     * Runs when some serials could not be provisioned
     * 
     * @param {*} invalidSerials Array of serials that were not able to be created
     */
    const onSemiSuccess = (invalidSerials) => {
        if (invalidSerials.length > 0) {
            setInvalid(invalidSerials);
        }
    }

    /* Handles stepping through warning dialog to the actual edit dialog */
    useEffect(() => {
        if (!nextDialog) return;
        if (childAssets.length > 0) {
            setDialogs({ assetEditWarning: true });
        } else {
            setDialogs({ [nextDialog]: true });
        }
    }, [childAssets, nextDialog, parentAssemblies]);

    /* Opens the invalid serials dialog whenever some serials could not be provisioned */
    useEffect(() => {
        if (invalidSerial.length > 0) {
            setDialogs({ invalid: true });
        }
    }, [invalidSerial]);

    /* Filter the results list */
    useEffect(() => {
        //generate the fetch url based on active filters and their keys
        const generateURL = (filters) => {
            let url = `${process.env.REACT_APP_API_URL}/assets`;
            const keys = Object.keys(filters);
            keys.forEach((key, idx) => {
                if (idx === 0) {
                    url = `${url}?${key}=${filters[key]}`;
                } else {
                    url = `${url}&${key}=${filters[key]}`;
                }
            });

            return url;
        };

        const urlToFetch = generateURL(filters);
        fetch(urlToFetch)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return { data: [], count: [{ count: 0 }] };
                }
            })
            .then(json => {
                const keys = Object.keys(filters);
                setAssets(json.data);
                setAssetCount(json.count[0].count);

                if (keys.includes("mapBounds") && keys.includes("mapView")) {
                    /* Store original found assets to restore the markers when last element is deselected */
                    setStoredAssets(json.data);

                    /* Sets markers to be displayed to the assets found if there are any */
                    setAssetMarkers(json.data);

                    /* Deselect any selected assets if they are no longer found in the new map viewport */
                    setSelected(s => {
                        const assetSerials = json.data.map(item => item.serial);
                        return s.filter(select => assetSerials.includes(select));
                    })
                } else {
                    setStoredAssets(null);
                    setAssetMarkers([]);
                }
            });
    }, [filters]);


    /* Reset results page to the first one whenever filters are changed */
    useEffect(() => {
        setFilters(s => ({ ...s, page: 0 }));
    }, [activeFilters]);

    /* Displays only the selected markers on the map if there are any, otherwise will display all assets found */
    useEffect(() => {
        if (selected.length && assetMarkers.length && map) {
            setFilteredMarkers(assetMarkers.filter((item) => selected.includes(item.serial)));
        } else if (!selected.length && map) {
            setFilteredMarkers(null);
        }
    }, [assetMarkers, map, selected]);

    return (
        <div>
            <Header heading="Assets" subheading="View All" />
            <div>
                <Grid container justify="space-between" spacing={2}>
                    {
                        map &&
                        (<Grid item xs={12} sm={12} md={8}>
                            <SimpleMap
                                data={filteredMarkers || storedAssets}
                                onBoundsChanged={(bounds) => {
                                    const mapView = "true";
                                    const mapBounds = encodeURI(bounds.join(","));
                                    setFilters(s => ({ ...s, mapBounds: mapBounds, mapView: mapView, page: 0 }));
                                }}
                                variant="search"
                                styling={{
                                    boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                    width: "100%",
                                    maxWidth: "85vw",
                                    height: "100%",
                                    minHeight: "70vh",
                                    marginLeft: "2%",
                                    position: "relative",
                                    borderRadius: "5px",
                                    zIndex: 500
                                }} />
                        </Grid>)
                    }
                    <Grid item xs={7} sm={11} md={map ? 4 : 12}>
                        <CustomTable
                            variant="asset"
                            data={assets}
                            selectedFields={selectedFields}
                            selected={selected}
                            count={assetCount}
                            checkboxes
                            filters={filters}

                            onFilterChange={(newFilters) => setFilters(s => ({ ...s, ...newFilters }))}
                            onSelectedChange={setSelected}
                            onAdditionalSelect={setAssetMarkers}
                            onValidate={validateAsset}> {/* function declaration at bottom of file */}

                            <TableToolbar selected={selected}>


                                {/* Table toolbar icons and menus */}
                                {/* Render main action if no items selected, edit actions if some are selected */}
                                {selected.length > 0 ?
                                    <>
                                        {/* Edit button */}
                                        <IconButton aria-label={"edit"} onClick={handleClick}>
                                            <EditIcon />
                                        </IconButton>

                                        {/* Floating menu for bulk edit actions */}
                                        <Menu
                                            id="edit-menu"
                                            anchorEl={anchor}
                                            keepMounted
                                            open={Boolean(anchor)}
                                            onClose={handleClose}>
                                            <MenuItem onClick={handleMenuClick} name="retire">Retire Assets</MenuItem>
                                            <MenuItem onClick={handleMenuClick} name="groupTag">Change Group Tag</MenuItem>
                                            <MenuItem onClick={handleMenuClick} name="assignee">Reassign</MenuItem>
                                            <MenuItem onClick={handleMenuClick} name="owner">Change Owner</MenuItem>
                                            <MenuItem onClick={handleMenuClick} name="assignmentType">Change Assignment Type</MenuItem>
                                        </Menu>
                                    </>
                                    :
                                    <>
                                        {/* Creator button */}
                                        <Grid container direction='row' justify="space-evenly">
                                            <Grid item xs={1}>
                                                <Tooltip title={"Create"}>
                                                    <IconButton aria-label={"create"} onClick={() => setDialogs({ create: true })}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                            {/* Table searchbar */}
                                            {
                                                !map &&
                                                (<Grid item xs={8} >
                                                    <TableSearchbar
                                                        searchValue={search}
                                                        onInputChange={(e) => setSearch(e.target.value)}
                                                        onSearch={handleKeyDown}
                                                        onClear={() => {
                                                            setSearch("");
                                                            setFilters(f => {
                                                                const newFilters = { ...f };
                                                                delete newFilters["search"];
                                                                return newFilters;
                                                            })
                                                        }}
                                                    />
                                                </Grid>)
                                            }



                                            {/* Map and List view buttons */}
                                            <Grid item xs={!map ? 1 : 4}>
                                                <Tooltip title={"Map View"}>
                                                    <div>
                                                        <IconButton
                                                            className={map ? classes.disabled : classes.enabled}
                                                            aria-label={"Map view button"}
                                                            onClick={() => toggleMap(true)}
                                                            disabled={map}
                                                        >
                                                            <MapIcon />
                                                        </IconButton>
                                                    </div>
                                                </Tooltip>
                                            </Grid>

                                            <Grid item xs={2}>
                                                <Tooltip title={"List View"}>
                                                    <div>
                                                        <IconButton
                                                            className={!map ? classes.disabled : classes.enabled}
                                                            aria-label={"List view button"}
                                                            onClick={() => {
                                                                toggleMap(false);
                                                                setFilters(f => {
                                                                    const newFilters = { ...f };
                                                                    delete newFilters["mapView"];
                                                                    delete newFilters["mapBounds"];
                                                                    return newFilters;
                                                                });
                                                            }}
                                                            disabled={!map}
                                                        >
                                                            <ListAltIcon />
                                                        </IconButton>
                                                    </div>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>

                                        {/* Filter button */}
                                        <Tooltip title={"Filter"}>
                                            <IconButton aria-label={"filter"} onClick={() => setDialogs({ filter: true })}>
                                                <FilterListIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                }
                            </TableToolbar>

                            {
                                map &&
                                (<TableSearchbar
                                    searchValue={search}
                                    onInputChange={(e) => setSearch(e.target.value)}
                                    onSearch={handleKeyDown}
                                    onClear={() => {
                                        setSearch("");
                                        setFilters(f => {
                                            const newFilters = { ...f };
                                            delete newFilters["search"];
                                            return newFilters;
                                        })
                                    }}
                                    disabled={selected.length > 0}
                                />)
                            }

                            {/* Chips representing all the active filters */}
                            <ChipBar
                                activeFilters={activeFilters}
                                setActiveFilters={setActiveFilters}
                                setFilters={setFilters} />

                        </CustomTable>
                    </Grid>
                </Grid>

            </div>

            {/* Put all the toolbar dialogs here */}
            <AssetFilter
                open={dialogs["filter"]}
                setOpen={(isOpen) => setDialogs({ filter: isOpen })}
                setActiveFilters={setActiveFilters}
                override={override} />

            <RetireAssetDialog
                open={dialogs["retire"]}
                setOpen={(isOpen) => setDialogs({ retire: isOpen })}
                selected={selected}
                onSuccess={onSuccess}
                override={override} />

            <ChangeGroupTagDialog
                open={dialogs["groupTag"]}
                setOpen={(isOpen) => setDialogs({ groupTag: isOpen })}
                selected={selected}
                onSuccess={onSuccess}
                override={override} />
            <ChangeAssignmentDialog
                open={dialogs["assignee"]}
                setOpen={(isOpen) => setDialogs({ assignee: isOpen })}
                selected={selected}
                onSuccess={onSuccess}
                override={override} />

            <ChangeOwnershipDialog
                open={dialogs["owner"]}
                setOpen={(isOpen) => setDialogs({ owner: isOpen })}
                selected={selected}
                onSuccess={onSuccess}
                override={override} />

            <ChangeAssignmentTypeDialog
                open={dialogs["assignmentType"]}
                setOpen={(isOpen) => setDialogs({ assignmentType: isOpen })}
                selected={selected}
                onSuccess={onSuccess}
                override={override} />

            <CreateAssetDialog
                open={dialogs["create"]}
                setOpen={(isOpen) => setDialogs({ create: isOpen })}
                onSuccess={onSuccess}
                onSemiSuccess={onSemiSuccess} />

            <InvalidSerialsDialog
                open={dialogs["invalid"]}
                setOpen={(isOpen) => setDialogs({ invalid: isOpen })}
                items={invalidSerial} />

            {/* Warning when asset is edited separately from its assembly */}
            <AssetEditWarning
                open={dialogs["assetEditWarning"]}
                setOpen={(isOpen) => setDialogs({ assetEditWarning: isOpen })}
                items={childAssets}
                handleOverride={() => {
                    setOverride(true);
                    setDialogs({ assetEditWarning: false })
                    setDialogs({ [nextDialog]: true })
                    setNext("")
                    setChildAssets([])
                }}
                containsAssemblies={Boolean(parentAssemblies.length)}
            />

            {/* Displays success or failure message */}
            <Snackbar open={success.succeeded !== null} autoHideDuration={5000} onClose={() => setSuccess({ succeeded: null, message: '' })} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ boxShadow: "1px 2px 6px #5f5f5f", borderRadius: "3px" }}>
                <Alert onClose={() => setSuccess({ succeeded: null, message: '' })} severity={success.succeeded ? "success" : "error"}>
                    {success.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

/**
 * Performs validation on an Asset to determine its displayed warnings and errors
 * 
 * @param {Object} item as Asset document to validate
 * @returns object containing arrays of the warnings and errors generated
 */
function validateAsset(item) {
    const warnings = [];
    const errors = [];

    if (item.assetType === "Assembly" && item.incomplete) {
        errors.push(`Assembly is incomplete (missing ${item.missingItems && item.missingItems.length} assets):`);
        item.missingItems && item.missingItems.map((missing, idx) => errors.push(<span key={idx}><b>{idx + 1}) &nbsp;</b>{missing}</span>))
    }

    if (item.assetType === "Assembly" && !item.assembled) {
        warnings.push("Assembly is marked 'disassembled'");
    }

    return { warnings: warnings, errors: errors, errorLength: errors.length - ((item.missingItems && item.missingItems.length) || 0) }
}

export default AllAssets;
