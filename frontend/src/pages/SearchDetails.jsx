import React, { useEffect, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';

import AssetFilter from '../components/Dialogs/AssetFilter';
import EventFilter from '../components/Dialogs/EventFilter';
import Header from '../components/Header';
import GenericTable from '../components/GenericTable';

import FilterListIcon from '@material-ui/icons/FilterList';

const assetFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];
const eventFields = ["key", "eventTime", "eventType"];
const assetMainAction = {
    action: "Filter",
    dialog: AssetFilter,
    icon: FilterListIcon,
    props: ["setActiveFilters"]
};

const eventMainAction = {
    action: "Filter",
    dialog: EventFilter,
    icon: FilterListIcon,
    props: ["setActiveFilters"]
};

const SearchDetails = (props) => {

    const [assets, setAssets] = useState([]);
    const [assetFilters, setAssetFilters] = useState({
        limit: 5
    });
    const [assetCount, setAssetCount] = useState(0);

    const [events, setEvents] = useState([]);
    const [eventFilters, setEventFilters] = useState({
        limit: 5
    });
    const [eventCount, setEventCount] = useState(0);

    const [searchTerm, setSearchTerm] = useState(props.match.params.query);


    useEffect(() => {
        //generate the fetch url based on active filters and their keys
        const generateURL = (type, filters) => {
            let url = `http://localhost:4000/${type}?search=${searchTerm}`;
            const keys = Object.keys(filters);
            keys.map((key, idx) => {
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
        console.log(eventUrl);

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

    }, [props.match.params.query, assetFilters, eventFilters]);


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            const { value } = event.target;
            setSearchTerm(value);
            props.history.push(`/search/${searchTerm}`);
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
                <GenericTable
                    data={assets}
                    title="Asset Results"
                    selectedFields={assetFields}
                    filters={assetFilters}
                    setFilters={setAssetFilters}
                    count={assetCount}
                    history={props.history}
                    variant="asset"
                    menuItems={[]}
                    mainAction={assetMainAction} />
            </div>

            <div>
                <GenericTable
                    data={events}
                    title="Event Results"
                    selectedFields={eventFields}
                    filters={eventFilters}
                    setFilters={setEventFilters}
                    count={eventCount}
                    history={props.history}
                    variant="event"
                    menuItems={[]}
                    mainAction={eventMainAction} />
            </div>
        </div>

    )
};

export default SearchDetails;