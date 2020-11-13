import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import AssetDetails from './pages/AssetDetails';
import CreateAssembly from './pages/CreateAssembly';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AllAssets from './pages/AllAssets';
import SearchDetails from './pages/SearchDetails';
import TestPage from './pages/TestPage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flexGrow: 12,
    paddingLeft: theme.spacing(12),
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
}))

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <div className={classes.root}>
        <div style={{ flexGrow: 0.5 }}>
          <Sidebar />
        </div>

        <main className={classes.content}>
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route path="/search/:query" component={SearchDetails} />
              <Route exact path="/assets/create-assembly" component={CreateAssembly} />
              <Route exact path="/assets/view-all" component={AllAssets} />
              <Route path="/assets/:serial" component={AssetDetails} />
              <Route path="/test" component={TestPage} />
              
            </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;
