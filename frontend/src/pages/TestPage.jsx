import React from 'react';
import AssetList from '../components/AssetList';
import Searchbar from '../components/Searchbar'

const TestPage = () => {

    return (
    <div>
        <h1> Assets </h1>
        <Searchbar />
        <AssetList />
    </div>);

}

export default TestPage;