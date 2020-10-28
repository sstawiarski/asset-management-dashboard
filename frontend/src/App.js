import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import './App.css';

import AssetDetails from './pages/AssetDetails';
import CreateAssembly from './pages/CreateAssembly';
import Searchbar from './components/Searchbar';
import AllAssets from './pages/AllAssets';
import TestPage from './pages/TestPage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/details" component={AssetDetails} />
          <Route path="/create-assembly" component={CreateAssembly} />
          <Route path="/all-assets" component = {AllAssets} />
          <Route path='/table-test' component = {TestPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
