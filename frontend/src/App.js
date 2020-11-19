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
    position: "relative"
  },
  content: {
    flexGrow: 12,
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
}))

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <div className={classes.root}>
      <Sidebar />
        <main className={classes.content}>
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route exact path="/test" component={TestPage} />
              <Route path="/search/:query" component={SearchDetails} />
              <Route exact path="/assets/create-assembly" component={CreateAssembly} />
              <Route exact path="/assets/view-all" component={AllAssets} />
              <Route path="/assets/:serial" component={AssetDetails} />
            </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;
