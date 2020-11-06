import React, { useState, useEffect } from 'react';

import Header from '../components/Header'
import GenericTable from '../components/GenericTable'

import AssetFilter from '../components/AssetFilter'
import RetireAssetDialog from '../components/RetireAssetDialog';

import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';

//array of dialogs, icons, and descriptors for the table
const menuItems = [{
    action: "Edit",
    dialog: RetireAssetDialog,
    icon: EditIcon,
    props: ["selected"]
}];

//the singular main action object for when no items are selected in the table
const mainAction = {
    action: "Filter",
    dialog: AssetFilter,
    icon: FilterListIcon,
    props: ["setActiveFilters"]
};

//the object fields to get for the table we need, in this case assets
const selectedFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];

const AllAssets = (props) => {

    const [assets, setAssets] = useState([]);
    const [filters, setFilters] = useState({
        limit: 5
    });
    const [assetCount, setAssetCount] = useState(0);

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
        console.log(urlToFetch)

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

    }, [filters])

    return (
        <div>
            <Header heading="Assets" subheading="View All" />
            <div>
                <GenericTable
                    data={assets}
                    title="All Assets"
                    selectedFields={selectedFields}
                    filters={filters}
                    setFilters={setFilters}
                    count={assetCount}
                    history={props.history}
                    variant="asset"
                    menuItems={menuItems}
                    mainAction={mainAction} />

            </div>
        </div>);

}

export default AllAssets;
