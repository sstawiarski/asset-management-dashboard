import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import AssetFilter from '../components/Dialogs/AssetFilter';
import EventFilter from '../components/Dialogs/EventFilter';
import Header from '../components/Header';
import CustomTable from '../components/Tables/CustomTable'
import TableToolbar from '../components/Tables/TableToolbar';
import ChipBar from '../components/Tables/ChipBar';

const assetFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];
const eventFields = ["key", "eventTime", "eventType"];

const SearchDetails = () => {
    const history = useHistory();
    const { query } = useParams();

    const [assets, setAssets] = useState([]);
    const [assetFilters, setAssetFilters] = useState({ limit: 5 });
    const [activeAssetFilters, setActiveAssetFilters] = useState({});
    const [assetCount, setAssetCount] = useState(0);

    const [events, setEvents] = useState([]);
    const [eventFilters, setEventFilters] = useState({ limit: 5 });
    const [activeEventFilters, setActiveEventFilters] = useState({});
    const [eventCount, setEventCount] = useState(0);

    const [searchTerm, setSearchTerm] = useState(query);
    const [dialogs, setDialogs] = useState({});


    useEffect(() => {
        //generate the fetch url based on active filters and their keys
        const generateURL = (type, filters) => {
            let url = `http://localhost:4000/${type}?search=${query}`;
            const keys = Object.keys(filters);
            keys.forEach((key) => {
                let value = filters[key];
                if (key === "eventType") {
                    value = encodeURI(value);
                }
                url = `${url}&${key}=${value}`;
            });

            return url;
        };

        const assetUrl = generateURL("assets", assetFilters);
        const eventUrl = generateURL("events", eventFilters);

        fetch(assetUrl)
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

        fetch(eventUrl)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return { data: [], count: [{ count: 0 }] };
                }
            })
            .then(json => {
                setEvents(json.data);
                setEventCount(json.count[0].count);
            });

    }, [query, assetFilters, eventFilters]);


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            history.push(`/search/${searchTerm}`);
        }
    };

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
    };

    return (
        <div>
            <Header heading="Search" subheading="Search Details" />
            <Box m={3}>
                <TextField
                    id="current-search"
                    label="Search"
                    variant="outlined"
                    style={{
                        backgroundColor: "white",
                        width: "50%",
                        paddingBotton: "20px"
                    }}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleEnter} />
            </Box>

            <div>
                <CustomTable
                    data={assets}
                    selectedFields={assetFields}
                    filters={assetFilters}
                    setFilters={setAssetFilters}
                    count={assetCount}
                    variant="asset"
                    selected={[]}
                    checkboxes={false}>

                    <TableToolbar
                        title="Asset Results"
                        selected={[]}>

                        <Tooltip title={"Filter"}>
                            <IconButton aria-label={"filter-assets"}>
                                <FilterListIcon onClick={() => setDialogs({ assetFilter: true })} />
                            </IconButton>
                        </Tooltip>

                    </TableToolbar>

                    <ChipBar activeFilters={activeAssetFilters} setActiveFilters={setActiveAssetFilters} setFilters={setAssetFilters} />

                </CustomTable>
            </div>

            <div>

                <CustomTable
                    data={events}
                    selectedFields={eventFields}
                    filters={eventFilters}
                    setFilters={setEventFilters}
                    activeFilters={activeEventFilters}
                    setActiveFilters={setActiveEventFilters}
                    count={eventCount}
                    variant="event"
                    selected={[]}
                    checkboxes={false}
                >
                    <TableToolbar
                        title="Event Results"
                        selected={[]}>

                        <Tooltip title={"Filter"}>
                            <IconButton aria-label={"filter-events"}>
                                <FilterListIcon onClick={() => setDialogs({ eventFilter: true })} />
                            </IconButton>
                        </Tooltip>

                    </TableToolbar>

                    <ChipBar activeFilters={activeEventFilters} setActiveFilters={setActiveEventFilters} setFilters={setEventFilters} />



                </CustomTable>

            </div>


            <AssetFilter open={dialogs["assetFilter"]} setOpen={(isOpen) => setDialogs({ assetFilter: isOpen })} setActiveFilters={setActiveAssetFilters} />
            <EventFilter open={dialogs["eventFilter"]} setOpen={(isOpen) => setDialogs({ eventFilter: isOpen })} setActiveFilters={setActiveEventFilters} />
        </div>

    )
};

export default SearchDetails;