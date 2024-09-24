import React, { Component } from "react";

import "./App.css";

import Home from "./components/Home.jsx";
import SearchResultCopy from "./components/search_engine/SearchResult.jsx";
import Details from "./components/search_engine/Details.jsx";

import WrappedNormalLoginForm from "./components/authentication/Login.jsx";
import Registration from './components/authentication/Registration';
import ResetPassword from './components/authentication/ResetPassword';
import Profile from './components/profile/Profile';
import Papers from './components/Papers';
import NotFount from './components/error_pages/404NotFount';


import StepForm from './components/upload_paper/UploadPaper';
import LinkPaper from './components/upload_paper/LinkPaper';


import "antd/dist/antd.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends Component {
  state = {};

  render() {
    return (
      <Router>
        <Switch>
          <div>
            <Switch>
              <Route exact path="/login" render={props => <WrappedNormalLoginForm {...props} />} />
              <Route exact path="/registration/" render={props => <Registration {...props} />} />
              <Route exact path="/upload-paper/" render={props => <StepForm {...props} />} />
              <Route exact path="/claim-papers/" render={props => <LinkPaper {...props} />} />
              <Route exact path="/reset-password-form/" render={props => <ResetPassword {...props} />} />
              {/* <Route exact path="/forgot-password" render={props => <ForgotPassword {...props}/>} /> */}
              <Route exact path="/author/:name/:id" render={props => <Papers {...props} />} />
              <Route path="/profile/" render={props => <Profile {...props} />} />
              <Route path="/papers/:search?" render={props => <SearchResultCopy {...props} />} />
              <Route exact path="/" render={props => <Home {...props} />} />
              <Route exact path="/paper-details/:id"
                render={props => <Details {...props} />}

              // component={Details}
              />
              <Route path='*' exact={true} component={NotFount} />
              {/* <Route exact path="/" render={props => <Details />} /> */}
            </Switch>
          </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
