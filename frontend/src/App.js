import React from 'react';
<<<<<<< HEAD
=======
import { Switch, Route, BrowserRouter } from 'react-router-dom'
>>>>>>> development
import './App.css';
import TestPage from './pages/TestPage'

import AssetDetails from './pages/AssetDetails';
import CreateAssembly from './pages/CreateAssembly';

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <TestPage />
=======
      <BrowserRouter>
        <Switch>
          <Route path="/details" component={AssetDetails} />
          <Route path="/create-assembly" component={CreateAssembly} />
        </Switch>
      </BrowserRouter>
>>>>>>> development
    </div>
  );
}

export default App;
