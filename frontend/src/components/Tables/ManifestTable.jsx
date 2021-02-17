import React, { useState, useEffect } from 'react';

import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import CustomTable from './CustomTable'
import TableToolbar from '../Tables/TableToolbar';
import ChipBar from '../Tables/ChipBar';



import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Button, Container, InputAdornment, TextField, Grid, Icon } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';

//the object fields to get for the table we need, in this case shipments
const selectedFields = ["id","status","shipFrom", "shipTo", "shipmentType"];

const ManifestTable = (props) => {

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

    //sample data
    const sampleManifests = [
        {"createdBy" : "John Doe",
        "created" : "2021-01-21",
        "status" : "completed" ,
        "shipmentType" : "incoming",
        "shipTo" : "Houston", 
        "shipFrom" : "Calgary",
        "latitude" : "30.36",
        "longitude" : "-95.48",
        "id" : "12213"
    },
        {"createdBy" : "James Doe",
        "created" : "2021-01-28",
        "status" : "completed", 
        "shipmentType" : "outgoing",
        "shipTo" : "Calgary", 
        "shipFrom" : "Houston",
        "latitude" : "30.66",
        "longitude" : "-95.58",
        "id" : "12155"
    },
        {"createdBy" : "Jane Doe",
        "created" : "2021-01-28",
        "status" : "staged",
        "shipmentType" : "outgoing",
        "shipTo" : "Calgary",
        "shipFrom" : "Houston",
        "latitude" : "30.46",
        "longitude" : "-95.58"
        ,"id" : "22154"
    }];

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
                if (json) {
                    try {
                        setManifests(json.data);
                        setManifestCount(json.count[0].count);
                    } catch (err) {
                        console.log(err);
                    }
                    
                }
            });
    }, [filters]);


    useEffect(() => {
        setFilters(s => ({ ...s, page: 0 }));
    }, [activeFilters])

        




    return (
        <div>
            <div>
                <CustomTable
                    data={sampleManifests}
                    selectedFields={selectedFields}
                    selected={selected}
                    setSelected={setSelected}
                    filters={filters}
                    setFilters={setFilters}
                    count={manifestCount}
                    variant="shipment"
                    checkboxes={true}
                    >

                    <TableToolbar
                        title="Manifests"
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
                                <Tooltip title={"Filter"}>
                                    <IconButton aria-label={"filter"} onClick={() => setDialogs({ filter: true })}>
                                        <FilterListIcon />
                                    </IconButton>
                                </Tooltip>
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

export default ManifestTable;