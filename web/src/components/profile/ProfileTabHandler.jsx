import React, { Component } from 'react'
import "./ProfileTabHandler.css"

import Account from"./AccountTab"
import Info from"./InfoTab"
import ChangePassword from"./ChangePasswordTab"
import SecurityLog from"./SecurityLogTab"

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export class ProfileComponents extends Component {
    render() {
        return (
            <div 
            // style={{padding:"30px",paddingTop:"0px"}}
             className="profile-component-container">
            <Route exact path="/profile/info" render={props => <Info {...props}/>} />
            <Route exact path="/profile/account" render={props => <Account {...props}/>} />
            <Route exact path="/profile/security" render={props => <ChangePassword {...props}/>} />
            <Route exact path="/profile/security-log" render={props => <SecurityLog {...props}/>} />

                
            </div>
        )
    }
}

export default ProfileComponents
