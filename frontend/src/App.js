import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import logo from "./logo.svg";
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
    flexDirection: "row",
  },
  content: {
    flexGrow: 12,
    marginBottom: "20px",
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
}))

function App() {
  const classes = useStyles();
  const [background, setBackground] = useState("#60ACBD");

  return (
    <div className="App">
      <div className={classes.root}>
      <div style={{
            background: background,
            lineHeight: "0px",
            boxShadow: "1px 0px 3px rgba(0,0,0,0.5)"
      }}>

      <Sidebar onOpen={setBackground}/>

      </div>
        <main className={classes.content}>
          <img src={logo} className="App-logo" alt="logo" />
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route exact path="/test" component={TestPage} />
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
