import React, { useState, useEffect } from 'react';

import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Header from '../components/Header'
import CustomTable from '../components/Tables/CustomTable'
import TableToolbar from '../components/Tables/TableToolbar';
import ChipBar from '../components/Tables/ChipBar';

import AssetFilter from '../components/Dialogs/AssetFilter'
import RetireAssetDialog from '../components/Dialogs/RetireAssetDialog';
import ChangeGroupTagDialog from '../components/Dialogs/ChangeGroupTagDialog';
import ChangeAssignmentDialog from '../components/Dialogs/ChangeAssignmentDialog';
import ChangeOwnershipDialog from '../components/Dialogs/ChangeOwnershipDialog';
import ChangeAssignmentTypeDialog from '../components/Dialogs/AssignmentTypeDialogue';
import AssetEditWarning from '../components/Dialogs/AssetEditWarning';
import CreateAssetDialog from '../components/Dialogs/CreateAssetDialog';
import InvalidSerialsDialog from '../components/Dialogs/InvalidSerialsDialog'

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Button, Container, InputAdornment, TextField, Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';

//the object fields to get for the table we need, in this case shipments
const selectedFields = ["created", "createdBy", "status", "shipmentType", "shipFrom", "shipTo"];

const AllManifests = (props) => {

    const [manifests, setManifests] = useState([]);
    const [childManifests, setChildManifests] = useState([]);
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [dialogs, setDialogs] = useState({});
    const [selected, setSelected] = useState([]);
    const [invalidSerial, setInvalid] = useState([]);
    const [manifestCount, setManifestCount] = useState(0);
    const [activeFilters, setActiveFilters] = useState({});
    const [anchor, setAnchor] = useState(null);
    const [nextDialog, setNext] = useState("");
    const [override, setOverride] = useState(false);
    const [success, setSuccess] = useState({ succeeded: null, message: '' });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setFilters(s => ({ ...s, search: e.target.value }))
        }
    }

    const handleClick = (event) => {
        setAnchor(event.currentTarget);
    }

    const handleClose = () => {
        setAnchor(null);
    }

    const handleMenuClick = (event) => {
        setAnchor(null);
        const children = [];
        setNext(event.target.getAttribute("name"));

        Promise.all(
            selected.map(serial =>
                fetch(`http://localhost:4000/shipments/${serial}?project=parentId`)
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
            setChildManifests(children)
        });

    }

    useEffect(() => {
        if (!nextDialog) return;
        if (childManifests.length > 0) {
            setDialogs({ assetEditWarning: true });
        } else {
            setDialogs({ [nextDialog]: true });
        }
    }, [childManifests, nextDialog]);

    const onSuccess = (succeeded, message) => {
        if (succeeded) {
            setSelected([]);
            setSuccess({ succeeded: succeeded, message: message });
            setActiveFilters({ ...activeFilters });
        } else {
            setSuccess({ succeeded: succeeded, message: message });
        }
    };

    //for use with creation of assets
    const onSemiSuccess = (invalidSerials) => {
        if (invalidSerials.length > 0) {
            setInvalid(invalidSerials);

        }
    }

    useEffect(() => {
        if (invalidSerial.length > 0) {
            setDialogs({ invalid: true });
        }
    }, [invalidSerial])

   useEffect(() => {
        //generate the fetch url based on active filters and their keys
        const generateURL = (filters) => {
            let url = "http://localhost:4000/shipments";
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
                setManifests(json.data);
                setManifestCount(json.count[0].count);
            });
    }, [filters]);


    useEffect(() => {
        setFilters(s => ({ ...s, page: 0 }));
    }, [activeFilters])

        




    return (
        <div>
            <Header heading="Manifests" subheading="View All" />
            <div>
                <CustomTable
                    data={manifests}
                    selectedFields={selectedFields}
                    selected={selected}
                    setSelected={setSelected}
                    filters={filters}
                    setFilters={setFilters}
                    count={manifestCount}
                    variant="shipment"
                    >

                    <TableToolbar
                        title="All Manifests"
                        selected={selected}>


                        {/* Table toolbar icons and menus */}
                        {/* Render main action if no items selected, edit actions if some are selected */}
                        {selected.length > 0 ?
                            <>
                                
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
                                
                                <Link to="/shipments/add-new" >
                                    <IconButton >
                                        <AddIcon />
                                    </IconButton>
                                </Link>
                                <Container className='searchBar' align='right'>
                                    <div >
                                        <TextField id="searchBox"
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                </Container>
                                
                            </>
                        }
                    </TableToolbar>

                    {/* Chips representing all the active filters */}
                    <ChipBar
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        setFilters={setFilters} />

                </CustomTable>

            </div>
           { /*put manifest filter here*/}

           
            
            {/* Displays success or failure message */}
            <Snackbar open={success.succeeded !== null} autoHideDuration={5000} onClose={() => setSuccess({ succeeded: null, message: '' })} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ boxShadow: "1px 2px 6px #5f5f5f", borderRadius: "3px" }}>
                <Alert onClose={() => setSuccess({ succeeded: null, message: '' })} severity={success.succeeded ? "success" : "error"}>
                    {success.message}
                </Alert>
            </Snackbar>
        </div>);

}

export default AllManifests;
