import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomeScreen from './HomeScreen';
import Navbar from './Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/reset/:token" component={Navbar}>
            {/* <Navbar resetToken={token}></Navbar> */}
            {/* <HomeScreen></HomeScreen> */}
          </Route>
          <Route path='/'>
            <Navbar></Navbar>
            <HomeScreen></HomeScreen>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Reset() {
  let { token } = useParams();
  return <h3>Requested reset ID: {token}</h3>;
}

export default App;
