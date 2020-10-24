
import React from 'react';
import AssetList from '../components/AssetList';
import AssetPageHeader from '../components/AssetPageHeader';
import Searchbar from '../components/Searchbar'
const TestPage = () => {

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

export default TestPage;