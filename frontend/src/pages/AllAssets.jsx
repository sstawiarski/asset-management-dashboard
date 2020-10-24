import React from 'react';
import AssetPageHeader from '../components/AssetPageHeader'
import AssetList from '../components/AssetList'
import Searchbar from '../components/Searchbar'

const AllAssets = () => {

    return (
        <div>
        <AssetPageHeader />
        <div
        style = {{margin: '10px 0 20px 0'}}>
            <Searchbar /></div>
        <div>    
            <AssetList />
        </div>
    </div>);

}

export default AllAssets;
