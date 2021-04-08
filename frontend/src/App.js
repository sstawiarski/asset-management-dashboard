import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Switch, Route, Redirect } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import logo from "./logo.svg";

import LoginPage from './pages/Login';
import Sidebar from './components/General/Sidebar';
import Dashboard from './pages/Dashboard';
import SearchDetails from './pages/SearchDetails';
import AccountDetails from'./pages/AccountDetails';

//Assets
import AllAssets from './pages/Assets/AllAssets';
import AssetDetails from './pages/Assets/AssetDetails';
import AssemblyManager from './pages/Assets/AssemblyManager';

//Shipments
import AllShipments from './pages/Shipments/AllShipments';
import ShipmentDetails from './pages/Shipments/ShipmentDetails';
import ShipmentCreator from './pages/Shipments/ShipmentCreator';

import useLocalStorage from './utils/auth/useLocalStorage.hook';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: "row",
    minHeight: "100vh",
    backgroundColor: "#F0FCFF"
  },
  content: {
    flexGrow: 12,
    marginBottom: "20px",
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}))

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#71AABB',
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: '#48656b',
    },
  },
});

function App() {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();
  const [local, ] = useLocalStorage('user', {});
  const [loggedIn, setLogged] = useState(false);

  useEffect(() => {
    if (!local || Object.keys(local).length <= 0) {
      setLogged(false);
    } else {
      setLogged(true);
    }
  }, [local]);

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/login" render={(props) => <LoginPage {...props} />} />
        {!loggedIn && Object.keys(local).length <= 0 ? <Redirect to='/login' /> : null}
        <Route>
          <div className="App">
            <div className={classes.root}>
              <div style={{ 
                boxShadow: "8px -12px 9px rgba(0,0,0,0.5)", 
              marginLeft: "-10px"
             }}>
                <Sidebar style={{ height: "100vh" }} location={location} />
              </div>
              <div className={classes.content}>
                <img src={logo} className="App-logo" title="Go to Dashboard" alt="logo" onClick={() => history.push('/')} />
                <Switch>
                  <Route path="/" exact component={Dashboard} />
                  <Route exact path="/test" component={null} />
                  <Route path="/search/:query" component={SearchDetails} />
                  <Route path="/shipments/view-all" component={AllShipments} />
                  <Route path="/shipments/track" component={null} />
                  <Route exact path="/shipments/create" component={ShipmentCreator} />
                  <Route path="/shipments/:key" component={ShipmentDetails} />
                  <Route exact path="/assets/assembly-manager" component={AssemblyManager} />
                  <Route exact path="/assets/view-all" component={AllAssets} />
                  <Route path="/assets/:serial" component={AssetDetails} />
                  <Route exact path="/account" component={AccountDetails} />
                  <Route exact path="/settings" component={null} />
                </Switch>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;