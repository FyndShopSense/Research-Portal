import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import "antd/dist/antd.css";
import "./Profile.css";

import ProfileComponents from "./ProfileTabHandler";

import NavBar from "../navbar/NavBar.jsx";
import Footer from "../footer/Footer.jsx";

import {Layout, Menu, Icon} from "antd";

const {SubMenu} = Menu;

class Sider extends React.Component {
  handleClick = e => {
    // console.log("click ", e);
  };

  render() {
    return (
      <React.Fragment>
       <div className="navbar-outer-div">
          <NavBar />
        </div>
        <div className="profile-outer-div">
        <div className="profile-left">
          <Menu
            onClick={this.handleClick}
            className="vertical-menu"
            style={{ width: "100%" }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["1"]}
            mode="inline"
          >
            <Menu.Item key="1">
              <Link to="/profile/info">
                <Icon type="appstore" />
                <span>Profile</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/profile/account">
                <Icon type="desktop" />
                <span>Account</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/profile/security">
                <Icon type="setting" />
                <span>Security</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/profile/security-log">
                <Icon type="calendar" />
                <span>Security Log</span>
              </Link>
            </Menu.Item>
          </Menu>
          <Menu
            onClick={this.handleClick}
            style={{ width: "100%" }}
            className="horizontal-menu"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["1"]}
            mode="horizontal"
          >
            <Menu.Item key="1">
              <Link to="/profile/info">
                <Icon type="appstore" />
                {/* <span>Profile</span> */}
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/profile/account">
                <Icon type="desktop" />
                {/* <span>Account</span> */}
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/profile/security">
                <Icon type="setting" />
                {/* <span>Security</span> */}
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/profile/security-log">
                <Icon type="calendar" />
                {/* <span>Security Log</span> */}
              </Link>
            </Menu.Item>
          </Menu>
        </div>
        
        <div className="profile-right">
          <ProfileComponents />
        </div>
        <div style={{clear:"both"}}></div>

        


        {/* <div className="home-footer"> */}
        </div>
        <div style={{clear:"both"}}></div>
        {/* <Footer /> */}
        {/* </div> */}
      </React.Fragment>
    );
  }
}
export default Sider;
