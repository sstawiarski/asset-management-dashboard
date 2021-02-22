import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import logo from "./logo.svg";
import AssetDetails from './pages/AssetDetails';
import CreateAssembly from './pages/CreateAssembly';
import Dashboard from './pages/Dashboard';
import AllAssets from './pages/AllAssets';
import AllManifests from './pages/AllManifests';
import SearchDetails from './pages/SearchDetails';
import TestPage from './pages/TestPage';
import LoginPage from './pages/Login';
import NewSidebar from './components/NewSidebar';
import AccountDetails from'./pages/AccountDetails';
import ShipmentDetails from './pages/ShipmentDetails';
import useLocalStorage from './utils/auth/useLocalStorage.hook';
import MapPage from './pages/MapPage';

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
                <NewSidebar style={{ height: "100vh" }} location={location} />
              </div>
              <div className={classes.content}>
                <img src={logo} className="App-logo" title="Go to Dashboard" alt="logo" onClick={() => history.push('/')} />
                <Switch>
                  <Route path="/" exact component={Dashboard} />
                  <Route exact path="/test" component={TestPage} />
                  <Route path="/search/:query" component={SearchDetails} />
                  <Route path="/shipments/view-all" component={AllManifests} />
                  <Route path="/shipments/track" component={MapPage} />
                  <Route path="/shipments/:key" component={ShipmentDetails} />
                  <Route exact path="/assets/assembly-manager" component={CreateAssembly} />
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