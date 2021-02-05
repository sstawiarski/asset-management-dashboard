import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import logo from "./logo.svg";
import AssetDetails from './pages/AssetDetails';
import CreateAssembly from './pages/CreateAssembly';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AllAssets from './pages/AllAssets';
import AllManifests from './pages/AllManifests';
import SearchDetails from './pages/SearchDetails';
import TestPage from './pages/TestPage';
import LoginPage from './pages/Login';
import useLocalStorage from './utils/auth/useLocalStorage.hook';

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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#71AABB',
    },
    secondary: {
      main: '#48656b',
    },
  },
});

function App() {
  const classes = useStyles();

  const history = useHistory();
  const [background, setBackground] = useState("#60ACBD");
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
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/login" render={(props) => <LoginPage {...props} />} />
        {!loggedIn && Object.keys(local).length <= 0 ? <Redirect to='/login' /> : null}
        <Route>
          <div className="App">
            <div className={classes.root}>
              <div style={{
                background: background,
                lineHeight: "0px",
                boxShadow: "1px 0px 3px rgba(0,0,0,0.5)"
              }}>
                <Sidebar onOpen={setBackground} />
              </div>
              <main className={classes.content}>
                <img src={logo} className="App-logo" title="Go to Dashboard" alt="logo" onClick={() => history.push('/')} />
                <Switch>
                  <Route path="/" exact component={Dashboard} />
                  <Route exact path="/test" component={TestPage} />
                  <Route path="/search/:query" component={SearchDetails} />
                  <Route path="/shipments/view-all" component={AllManifests} />
                  <Route exact path="/assets/create-assembly" component={CreateAssembly} />
                  <Route exact path="/assets/view-all" component={AllAssets} />
                  <Route path="/assets/:serial" component={AssetDetails} />
                </Switch>
              </main>
            </div>
          </div>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
