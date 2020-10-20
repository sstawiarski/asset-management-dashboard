import React from 'react';
import AssetList from '../components/AssetList';
import Searchbar from '../components/Searchbar'

const TestPage = () => {

    return (
    <div>
        <h1> Assets </h1>
        <Searchbar />
        <div
        style = {{margin: '10px 0px 0px 0px'}}>        
            <AssetList />
        </div>
    </div>);

}

export default TestPage;