import React from 'react';

import AssetList from '../components/AssetList'
import Header from '../components/Header'

const AllAssets = () => {

    return (
        <div>
        <Header heading="Assets" subheading="View All" />
        <div>    
            <AssetList />
        </div>
    </div>);

}

export default AllAssets;
