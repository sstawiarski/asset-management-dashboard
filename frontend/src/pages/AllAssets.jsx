import React, { useEffect, useState } from 'react';

import AssetTable from '../components/AssetTable'
import Header from '../components/Header'

const AllAssets = () => {
    const [assets, setAssets] = useState([]);
    const [filters, setFilters] = useState({});

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
                return;
            });

            return url;
        };

        const urlToFetch = generateURL(filters);

        fetch(urlToFetch)
            .then(response => response.json())
            .then(json => setAssets(json));

    }, [filters]);

    return (
        <div style={{ marginLeft: "10px" }}>
            <Header heading="Assets" subheading="View All" />
            <div>
                {/* Pass in setFilters method so page can know of the active filters */}
                <AssetTable data={assets} setFilters={setFilters} />
            </div>
        </div>);

}

export default AllAssets;