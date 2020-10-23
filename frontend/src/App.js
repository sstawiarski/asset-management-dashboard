import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import './App.css';

import AssetDetails from './pages/AssetDetails';
import CreateAssembly from './pages/CreateAssembly';
import Searchbar from './components/Searchbar';

function App() {
  return (
    <div className="App">
      <Searchbar />
      <BrowserRouter>
        <Switch>
          <Route path="/details" component={AssetDetails} />
          <Route path="/create-assembly" component={CreateAssembly} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
