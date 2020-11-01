import React, { useEffect, useState } from 'react';

import AssetTable from '../components/AssetTable'
import Header from '../components/Header'

const AllAssets = () => {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/assets")
            .then(response => response.json())
            .then(json => setAssets(json));
    }, [])

    return (
        <div style={{marginLeft: "10px"}}>
            <Header heading="Assets" subheading="View All" />
            <div>
                <AssetTable data={assets} />
            </div>
        </div>);

}

export default AllAssets;