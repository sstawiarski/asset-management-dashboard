import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Switch, Route, Redirect } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import logo from "./logo.svg";

import Sidebar from './components/Sidebar';

import AssetDetails from './pages/AssetDetails';
import AssemblyManager from './pages/AssemblyManager';
import Dashboard from './pages/Dashboard';
import AllAssets from './pages/AllAssets';
import AllManifests from './pages/AllManifests';
import SearchDetails from './pages/SearchDetails';
import LoginPage from './pages/Login';

import AccountDetails from'./pages/AccountDetails';
import ShipmentDetails from './pages/ShipmentDetails';
import ShipmentCreator from './pages/ShipmentCreator';

import useLocalStorage from './utils/auth/useLocalStorage.hook';

//Redis connection
var client = redis.createClient('redis://127.0.0.1:6379');
client.on("error", (err) => {
    console.error(err);
});

var isCached = (req, res, next) => {
    const { id } = req.params;
    //First check in Redis
    client.get(id, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            const reponse = JSON.parse(data);
            return res.status(200).json(reponse);
        }
        next();
    });
}

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
                  <Route path="/shipments/view-all" component={AllManifests} />
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