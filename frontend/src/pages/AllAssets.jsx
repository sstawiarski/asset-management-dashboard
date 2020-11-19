import React, { useState, useEffect } from 'react';

import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Header from '../components/Header'
import CustomTable from '../components/Tables/CustomTable'
import TableToolbar from '../components/Tables/TableToolbar';

import AssetFilter from '../components/Dialogs/AssetFilter'
import RetireAssetDialog from '../components/Dialogs/RetireAssetDialog';
import ChangeGroupTagDialog from '../components/Dialogs/ChangeGroupTagDialog';
import ChangeAssignmentDialog from '../components/Dialogs/ChangeAssignmentDialog';
import ChangeOwnershipDialog from '../components/Dialogs/ChangeOwnershipDialog';
import ChangeAssignmentTypeDialog from '../components/Dialogs/AssignmentTypeDialogue';

//the object fields to get for the table we need, in this case assets
const selectedFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];

const AllAssets = (props) => {

    const [assets, setAssets] = useState([]);
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [dialogs, setDialogs] = useState({});
    const [selected, setSelected] = useState([]);
    const [assetCount, setAssetCount] = useState(0);
    const [activeFilters, setActiveFilters] = useState({});
    const [anchor, setAnchor] = useState(null);

    const handleClick = (event) => {
        setAnchor(event.currentTarget);
    }

    const handleClose = () => {
        setAnchor(null);
    }

    const handleMenuClick = (event) => {
        setAnchor(null);
        setDialogs({ [event.target.getAttribute("name")]: true });
    }

    useEffect(() => {

        //generate the fetch url based on active filters and their keys
        const generateURL = (filters) => {
            let url = "http://localhost:4000/assets";
            const keys = Object.keys(filters);
            keys.map((key, idx) => {
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
                setAssets(json.data);
                setAssetCount(json.count[0].count);
            });

    }, [filters]);

    return (
        <div>
            <Header heading="Assets" subheading="View All" />
            <div>
                <CustomTable
                    data={assets}
                    selectedFields={selectedFields}
                    selected={selected}
                    setSelected={setSelected}
                    filters={filters}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    setFilters={setFilters}
                    count={assetCount}
                    variant="asset"
                    checkboxes={true}>

                    <TableToolbar
                        title="All Assets"
                        selected={selected}>

                        {/* Table toolbar icons and menus */}
                        {/* Render main action if no items selected, edit actions if some are selected */}
                        {selected.length > 0 ?
                            <>
                                <IconButton aria-label={"edit"}>
                                    <EditIcon onClick={handleClick} />
                                </IconButton>
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
                            <Tooltip title={"Filter"}>
                                <IconButton aria-label={"filter"}>
                                    <FilterListIcon onClick={() => setDialogs({ filter: true })} />
                                </IconButton>
                            </Tooltip>}




                    </TableToolbar>

                </CustomTable>

            </div>

            {/* Put all the toolbar dialogs here */}
            <AssetFilter open={dialogs["filter"]} setOpen={(isOpen) => setDialogs({ filter: isOpen })} setActiveFilters={setActiveFilters} />
            <RetireAssetDialog open={dialogs["retire"]} setOpen={(isOpen) => setDialogs({ retire: isOpen })} selected={selected} />
            <ChangeGroupTagDialog open={dialogs["groupTag"]} setOpen={(isOpen) => setDialogs({ groupTag: isOpen })} selected={selected} />
            <ChangeAssignmentDialog open={dialogs["assignee"]} setOpen={(isOpen) => setDialogs({ assignee: isOpen })} selected={selected} />
            <ChangeOwnershipDialog open={dialogs["owner"]} setOpen={(isOpen) => setDialogs({ owner: isOpen })} selected={selected} />
            <ChangeAssignmentTypeDialog open={dialogs["assignmentType"]} setOpen={(isOpen) => setDialogs({ assignmentType: isOpen })} selected={selected} />
        </div>);

}

export default AllAssets;
