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


import ShipmentFilter from '../components/Dialogs/ShipmentFilter';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Button, Container, InputAdornment, TextField, Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';

//the object fields to get for the table we need, in this case shipments
const selectedFields = ["key", "shipmentType", "status", "shipFrom", "shipTo", "updated", "createdBy", "created"];

const AllShipments = (props) => {

    const [shipments, setShipments] = useState([]);
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [dialogs, setDialogs] = useState({});
    const [selected, setSelected] = useState([]);
    const [shipmentCount, setShipmentCount] = useState(0);
    const [activeFilters, setActiveFilters] = useState({});
    const [anchor, setAnchor] = useState(null);
    const [success, setSuccess] = useState({ succeeded: null, message: '' });

   
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setFilters(s => ({ ...s, search: e.target.value }))
            console.log(filters);

        }

    }

    const handleClose = () => {
        setAnchor(null);
    }


   useEffect(() => {
        //generate the fetch url based on active filters and their keys
        const generateURL = (filters) => {
            let url = `${process.env.REACT_APP_API_URL}/shipments`;
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
                setShipments(json.data);
                setShipmentCount(json.count[0].count);
            });
    }, [filters]);


    useEffect(() => {
        setFilters(s => ({ ...s, page: 0 }));
    }, [activeFilters])

        




    return (
        <div>
            <Header heading="Shipments" subheading="View All" />
            <div>
                <CustomTable
                    data={shipments}
                    selectedFields={selectedFields}
                    selected={selected}
                    setSelected={setSelected}
                    filters={filters}
                    setFilters={setFilters}
                    count={shipmentCount}
                    variant="shipment"
                    >

                    <TableToolbar
                        title="All Shipments"
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
  
                                </Menu>
                            </>
                            :
                            <>
                                
                                <Link to="/shipments/create" >
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
                                <IconButton onClick={() => setDialogs(s => ({ ...s, filter: true}))}>
                                        <FilterListIcon />
                                    </IconButton>
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
            { /*put shipment filter here*/}
            <ShipmentFilter 
                open={dialogs["filter"]} 
                setOpen={(isOpen) => setDialogs(d => ({ ...d, filter: isOpen }))} 
                setActiveFilters={setActiveFilters} 
            />
           
            
            {/* Displays success or failure message */}
            <Snackbar open={success.succeeded !== null} autoHideDuration={5000} onClose={() => setSuccess({ succeeded: null, message: '' })} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ boxShadow: "1px 2px 6px #5f5f5f", borderRadius: "3px" }}>
                <Alert onClose={() => setSuccess({ succeeded: null, message: '' })} severity={success.succeeded ? "success" : "error"}>
                    {success.message}
                </Alert>
            </Snackbar>
        </div>);

}

export default AllShipments;
