import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

//Material-UI Components
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

//Custom Components
import ShipmentFilter from '../../components/Dialogs/ShipmentDialogs/ShipmentFilter';
import ChangeStatusDialog from '../../components/Dialogs/AssetDialogs/ChangeStatusDialog';
import Header from '../../components/General/Header'
import CustomTable from '../../components/Tables/CustomTable'
import TableToolbar from '../../components/Tables/TableToolbar';
import ChipBar from '../../components/Tables/ChipBar';
import TableSearchbar from '../../components/Tables/TableSearchbar';

//Icons
import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

//the object fields to get for the table we need, in this case shipments
const selectedFields = ["key", "shipmentType", "status", "shipFrom", "shipTo", "updated", "createdBy", "created"];

const AllShipments = (props) => {


    const isWarning = false; // TODO: temporary fix for dialogs only opening once due to warning check not being implemented (yet?)
    const [currentTab, setCurrentTab] = useState("All");
    const [shipments, setShipments] = useState([]);
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [nextDialog, setNext] = useState("");
    const [dialogs, setDialogs] = useState({});
    const [selected, setSelected] = useState([]);
    const [shipmentCount, setShipmentCount] = useState(0);
    const [activeFilters, setActiveFilters] = useState({});
    const [anchor, setAnchor] = useState(null);
    const [success, setSuccess] = useState({ succeeded: null, message: '' });
    const [search, setSearch] = useState("");


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const { value } = e.target;
            setFilters(s => ({ ...s, search: value }));
            setSearch(value);
        }
    }

    /* Handle floating menu placement for toolbar */
    const handleClick = (event) => {
        setAnchor(event.currentTarget);
    }

    /* handle change of tab view */
    const handleTabChange = (event, newValue) => {

        /* Remove the filter if all shipment types are selected */
        if (newValue === "All") {
            setFilters(f => {
                const newFilters = { ...f };
                delete newFilters["status"];
                newFilters["page"] = 0;
                return newFilters;
            });
        } else {
            setFilters(f => ({ ...f, status: newValue, page: 0 }));
        }

        setCurrentTab(newValue);
    };

    const handleClose = () => {
        setAnchor(null);
    }


    const handleMenuClick = (event) => {
        setAnchor(null);
        const name = event.target.getAttribute("name");

        // TODO: temporary fix for dialogs only opening once due to warning check not being implemented (yet?)
        if (isWarning) setNext(name);
        else setDialogs(d => ({ ...d, [name]: true }));
    }

    // const handleMenuClick = (event) => {
    //     setAnchor(null);
    //     const children = [];
    //     setNext(event.target.getAttribute("name"));

    //     Promise.all(
    //         selected.map(key =>
    //             fetch(`${process.env.REACT_APP_API_URL}/shipments`)
    //                 .then(resp => {
    //                     if (resp.status < 300) {
    //                         return resp.json()
    //                     }
    //                     return null;
    //                 })
    //         )
    //     ).then(jsons => {
    //         jsons.forEach((item, idx) => {
    //             if (item) {
    //                 if (!item.parentId) return;
    //                 if (!selected.includes(item.parentId)) {
    //                     children.push(selected[idx]);
    //                 }
    //             }
    //             return;
    //         })

    //     });

    // }



    /* Handles stepping through warning dialog to the actual edit dialog */
    useEffect(() => {
        if (!nextDialog) return;

        setDialogs({ [nextDialog]: true });

    }, [nextDialog]);

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

    useEffect(() => {
        //generate the fetch url based on active filters and their keys
        const generateURL = (filters) => {
            let url = `${process.env.REACT_APP_API_URL}/shipments`;
            const keys = Object.keys(filters);
            keys.forEach((key, idx) => {
                if (idx === 0) url = `${url}?`
                url = `${url}&${key}=${filters[key]}`;

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
    }, [activeFilters]);



    return (
        <div>
            <Header heading="Shipments" subheading="View All" />

            <div>
                <CustomTable
                    variant="shipment"
                    data={shipments}
                    selectedFields={selectedFields}
                    selected={selected}
                    filters={filters}
                    count={shipmentCount}
                    checkboxes={true}

                    onFilterChange={(newFilters) => setFilters(s => ({ ...s, ...newFilters }))}
                    onSelectedChange={setSelected}>


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
                                    <MenuItem onClick={handleMenuClick} name="status">Change Status</MenuItem>
                                </Menu>
                            </>
                            :
                            <>

                                <Link to="/shipments/create" >
                                    <IconButton >
                                        <AddIcon />
                                    </IconButton>
                                </Link>

                                {/* Shipment Status tabs */}
                                <Tabs variant="scrollable" aria-label="shipment status tabs" value={currentTab} onChange={handleTabChange}>
                                    <Tab label="All" value="All" name="All" />
                                    <Tab label="Staging" value="Staging" name="Staging" />
                                    <Tab label="Completed" value="Completed" name="Completed" />
                                    <Tab label="Abandoned" value="Abandoned" name="Abandoned" />
                                </Tabs>


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
                                    disabled={selected.length > 0}
                                />


                                <IconButton onClick={() => setDialogs(s => ({ ...s, filter: true }))}>
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
                disableStatusFilter={true}
            />

            <ChangeStatusDialog
                open={dialogs["status"]}
                setOpen={(isOpen) => setDialogs(d => ({ ...d, status: isOpen }))}
                selected={selected}
                onSuccess={onSuccess}
            />


            {/* Displays success or failure message */}
            <Snackbar open={success.succeeded !== null} autoHideDuration={5000} onClose={() => setSuccess({ succeeded: null, message: '' })} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ boxShadow: "1px 2px 6px #5f5f5f", borderRadius: "3px" }}>
                {
                    success.succeeded !== null ?
                        <Alert onClose={() => setSuccess({ succeeded: null, message: '' })} severity={success.succeeded ? "success" : "error"}>
                            {success.message}
                        </Alert>
                        : null
                }
            </Snackbar>
        </div>);

}

export default AllShipments;
