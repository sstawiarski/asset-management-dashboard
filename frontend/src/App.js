import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import AssetDetails from './pages/AssetDetails';
import CreateAssembly from './pages/CreateAssembly';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AllAssets from './pages/AllAssets';
import SearchDetails from './pages/SearchDetails';
import TestPage from './pages/TestPage';
import LoginPage from './pages/Login';
import useLocalStorage from './utils/auth/useLocalStorage.hook';

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
  const [local, setLocal] = useLocalStorage('user', {});
  const [loggedIn, setLogged] = useState(false);

  useEffect(() => {
    if (!local || Object.keys(local).length <= 0) {
      setLogged(false);
    } else {
      setLogged(true);
    }
  }
  , [local])

  return (
      <Switch>
        <Route exact path="/login" render={(props) => <LoginPage {...props} />} />
        {!loggedIn ? <Redirect to='/login' /> : null}
        <Route>
          <div className="App">
            <div className={classes.root}>
              <div style={{
                lineHeight: "0px",
                boxShadow: "1px 0px 3px rgba(0,0,0,0.5)"
              }}>
                <Sidebar onOpen={() => {}} />

              </div>
              <main className={classes.content}>
        
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
        </Route>
      </Switch>
  );
}

export default App;
