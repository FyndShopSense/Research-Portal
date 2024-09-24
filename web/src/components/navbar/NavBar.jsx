import React, {Component} from "react";
import {Menu, Dropdown, Icon, message} from "antd";

import "./NavBar.css";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

class NavBar extends Component {
    state = {
        isLogin: false,
        user_name: "User Name",
        user_email: "User Email"
    };

    handleMenuClick = () => {
        // console.log(document.getElementById("second-nav-id").offsetHeight);
        // console.log(document.getElementById("second-nav-id").childNodes.length * 45.8);
        if (document.getElementById("second-nav-id").offsetHeight == 0) {
            document.getElementById("second-nav-id").style.height =
                document.getElementById("second-nav-id").childNodes.length * 45.8 +
                "px";
        } else {
            document.getElementById("second-nav-id").style.height = "0px";
        }
    };

    componentDidMount = () => {
        if (localStorage.getItem("login-data")) {
            this.setState({
                isLogin: true,
                user_name: localStorage.getItem("user_name"),
                user_email: localStorage.getItem("user_email"),
                user_id: localStorage.getItem("user_id")
            });
        }
    };

    handleLogout = e => {
        localStorage.clear();
        this.setState({isLogin: false});
        // this.props.history.push("/");
        message.info("You have logged out successfully");
    };

    render() {
        return (
            <React.Fragment>
                <nav className="nav-bar">
                    <Link to="/">
                        <div className="nav-bar-logo">
                            {/*  document logo*/}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="35"
                                height="35"
                                viewBox="0 0 80 80"
                                style={{fill: "#000000"}}
                            >
                                <path
                                    fill="#fff"
                                    d="M12.5 75.5L12.5 4.5 49.793 4.5 67.5 22.207 67.5 75.5z"
                                ></path>
                                <path
                                    fill="#788b9c"
                                    d="M49.586,5L67,22.414V75H13V5H49.586 M50,4H12v72h56V22L50,4L50,4z"
                                ></path>
                                <path
                                    fill="#fff"
                                    d="M49.5 22.5L49.5 4.5 49.793 4.5 67.5 22.207 67.5 22.5z"
                                ></path>
                                <path
                                    fill="#788b9c"
                                    d="M50 5.414L66.586 22H50V5.414M50 4h-1v19h19v-1L50 4 50 4zM24 32H56V33H24zM24 38H48V39H24zM24 44H56V45H24zM24 50H48V51H24zM24 56H56V57H24z"
                                ></path>
                            </svg>
                            <span className="logo-text">Research Portal</span>
                        </div>
                    </Link>
                    <div style={{flex: 1}}></div>
                    <div className="navbar-right-content">
                        {this.state.isLogin ? (
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item key="0">
                                            <Link to="/upload-paper">
                                                <a>Upload Paper</a>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="1">
                                            <Link
                                                to={"/author/" + this.state.user_name.replace(/\s+/g, '-') + "/" + this.state.user_id + "/"}>
                                                <a>My Papers</a>
                                            </Link>
                                        </Menu.Item>
                                        {/* <Menu.Item key="1">
                    <Link to="/login">
                      <a href="http://www.taobao.com/">My Profile</a>
                    </Link>
                  </Menu.Item> */}
                                        <Menu.Item key="2">
                                            <Link to="/claim-papers">
                                                <a>Claim Papers</a>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                            <Link to="/profile/info">
                                                <a>Settings</a>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item key="3">
                                            <Link onClick={this.handleLogout}>
                                                <a>Log Out</a>
                                            </Link>
                                        </Menu.Item>
                                    </Menu>
                                }
                                trigger={["click"]}
                                className="navbar-right-element"
                            >
                                <a className="ant-dropdown-link" href="#">
                                    {this.state.user_name} <Icon type="down"/>
                                </a>
                            </Dropdown>
                        ) : (
                            <React.Fragment>
                                <Link to="/registration">
                  <span className="nav-sign-up navbar-right-element">
                    <span>Create Account</span>
                  </span>
                                </Link>

                                <Link to="/login">
                  <span className="nav-sign-in navbar-right-element">
                    Sign In
                  </span>
                                </Link>
                            </React.Fragment>
                        )}
                    </div>
                    <Icon
                        type="menu"
                        className="home-menu-icon"
                        onClick={this.handleMenuClick}
                        id="nav-bar-menu-open-icon"
                    />
                </nav>
                <nav className="second-nav" id="second-nav-id">
                    <div>{this.state.user_name}</div>
                    <Link to="/upload-paper">
                        <div>Upload Papers</div>
                    </Link>
                    <Link to="/papers">
                        <div>My Profile</div>
                    </Link>
                    <Link to="/profile/info">
                        <div>Settings</div>
                    </Link>
                    <div>Logout</div>
                </nav>
            </React.Fragment>
        );
    }
}

export default NavBar;
