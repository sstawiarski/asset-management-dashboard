import React from 'react';
import Box from '@material-ui/core/Box';

import AssetList from '../components/AssetList'
import Header from '../components/Header'
import AssetFilter from '../components/AssetFilter'

const AllAssets = () => {

    return (
        <div>
        <Header heading="Assets" subheading="View All" />
        <div>
            
            <AssetFilter />
           
        </div>
        <div>    
            <AssetList />
        </div>
    </div>);

}

export default AllAssets;
