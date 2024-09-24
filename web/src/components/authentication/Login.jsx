import React from "react";
import "./Login.css";
import {
    Button, Checkbox, Form, Icon, Input, Divider, Modal, message, Tag
} from "antd";
import ReactDOM from "react-dom";
import GoogleLogin from "react-google-login";
import NavBar from "../navbar/NavBar.jsx";
import Footer from "../footer/Footer";
import axios from "axios";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

import constants from "../../constants";


class NormalLoginForm extends React.Component {
    state = {
        loadingConformPassword: false,
        visibleConformPasswordPopup: false,
        incorrectPasswordMessage: false,
        loading: false
    };

    showConformPasswordModal = () => {
        this.setState({
            visibleConformPasswordPopup: true,
        });
    };


    handleConformPasswordOk = () => {
        this.props.form.validateFieldsAndScroll(['e-mail address'], (err, values) => {
            if (!err) {
                // console.log("Received values of form: ", values);
                if (values["e-mail address"]) {
                    this.setState({loadingConformPassword: true});
                    setTimeout(() => {
                        message.info("Please check your email and click on the provided link to reset your password.", 5);
                        this.setState({
                            loadingConformPassword: false,
                            visibleConformPasswordPopup: false,
                        });
                    }, 1000);
                }
            }
        });
    };

    handleConformPasswordCancel = () => {
        this.setState({visibleConformPasswordPopup: false});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({incorrectPasswordMessage: false});

        this.props.form.validateFields(['email', 'password'], (err, values) => {
            if (!err) {
                this.setState({loading: true});
                axios.post(constants.flaskServerUrl + 'login/', {
                    user_email: values.email,
                    password: values.password,
                }).then((res) => {
                    // console.log(res.status);
                    // console.log(res.config.data);
                    if (res.status === 200) {
                        console.log(res);
                        this.setState({loading: false});
                        message.success("Login successful. Redirecting you to homepage...");
                        // localStorage.setItem('login-data', JSON.stringify(res.config.data));
                        localStorage.setItem("login-data", true);
                        localStorage.setItem("user_email", values.email);
                        localStorage.setItem("user_name", res.data.user_name);
                        localStorage.setItem("user_id", res.data.user_id);
                        localStorage.setItem("user_institute", res.data.user_institute);

                        setTimeout(() => {
                            this.props.history.push("/");
                        }, 1000);


                    } else {
                        this.setState({incorrectPasswordMessage: true});
                        this.setState({loading: false});
                        this.props.form.resetFields()
                    }
                })
                    .catch((error) => {
                        if (error.response) {
                            // console.log(error.response.data);
                            // console.log(error.response.status);
                            // console.log(error.response.headers);

                            if (error.response.status === 401) {
                                this.setState({incorrectPasswordMessage: true});
                                this.setState({loading: false});
                                message.error("Incorrect credentials entered. Please try again.", 5);
                                this.props.form.resetFields()
                            } else {
                                this.props.form.resetFields();
                                message.error("Error! try again");
                                this.setState({loading: false});
                            }
                        }
                    });

                // console.log("Received values of form: ", values);
            }
        });
    };

    responseGoogle = (response) => {
        // console.log(response);
        if ("profileObj" in response) {
            let user_name = response["profileObj"]["name"];
            var name_split = user_name.toLowerCase().split(" ");
            user_name = "";
            for (var i = 0; i < name_split.length; ++i) {
                user_name += name_split[i][0].toUpperCase() + name_split[i].slice(1)
                if (i !== name_split.length - 1) {
                    user_name += " ";
                }
            }

            let user_email = response["profileObj"]["email"];
            let data = {"user_name": user_name, "user_email": user_email, "profile_completed": false};
            localStorage.setItem('google-oauth-data', JSON.stringify(data));
            localStorage.setItem("login-data", true);
            localStorage.setItem("user_email", user_email);
            localStorage.setItem("user_name", user_name);

            setTimeout(() => {
                // this.props.history.push("/registration");
                this.props.history.push("/");

                message.success("Login via Google successful", 3);
                message.info("Please complete your profile to access all the features of the site", 7);
            }, 3000);
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;


        return (
            <React.Fragment>
                <Modal
                    visible={this.state.visibleConformPasswordPopup}
                    title="Enter your email address"
                    onOk={this.handleConformPasswordOk}
                    onCancel={this.handleConformPasswordCancel}
                    footer={[
                        <Button key="back" onClick={this.handleConformPasswordCancel}> Return </Button>,
                        <Button type="primary" loading={this.state.loadingConformPassword}
                                onClick={this.handleConformPasswordOk}>
                            Submit
                        </Button>,
                    ]}>

                    <Form>
                        <Form.Item>
                            {getFieldDecorator("e-mail address", {
                                rules: [{
                                    required: true,
                                    message: "Please enter your registered email address",
                                    type: "email"
                                }],
                            })(
                                <Input prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>}
                                       placeholder="E-mail address"/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>

                <div className="navbar-outer-div"><NavBar/></div>

                <div style={{paddingTop: "90px"}}></div>

                <Form onSubmit={this.handleSubmit} className="login-form-sign-in">

                    <div style={{width: "100%"}}>
                        <GoogleLogin
                            clientId={constants.google_oauth_client_id}
                            buttonText="Login With Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={"single_host_origin"}
                            style={{width: "100%"}}
                        />
                    </div>

                    <Divider>OR</Divider>

                    <Form.Item>
                        {getFieldDecorator("email", {
                            rules: [
                                {required: true, message: "Enter a valid email address", type: "email"},
                            ]
                        })(
                            <Input type="email" prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>}
                                   placeholder="Email"/>
                        )}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator("password", {
                            rules: [
                                {required: true, message: "Please enter your password"},
                            ],
                        })(
                            <Input type="password" prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>}
                                   placeholder="Password"/>
                        )}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator("remember", {
                            valuePropName: "checked",
                            initialValue: true,
                        })(
                            <Checkbox style={{paddingRight: "20%"}}>Remember me</Checkbox>
                        )}

                        <span style={{color: "#1890ff", cursor: "pointer"}} onClick={this.showConformPasswordModal}>
                            Forgot password?
                        </span>

                        <br/>

                        {/*{this.state.incorrectPasswordMessage && <Tag color="red">Incorrect user id or password !</Tag>}*/}

                        <Button type="primary" htmlType="submit" className="login-form-button"
                                loading={this.state.loading}
                                style={{width: "100%", marginTop: "20px"}}>
                            Log in
                        </Button>
                        Don't have an account?
                        <Link to="/registration"> <span style={{marginLeft: "5px"}}>Sign Up!</span> </Link>
                    </Form.Item>
                </Form>

                <div className="home-footer">
                    <Footer/>
                </div>

            </React.Fragment>
        );
    }
}

const WrappedNormalLoginForm = Form.create({name: "normal_login"})(
    NormalLoginForm
);

// ReactDOM.render(<WrappedNormalLoginForm/>, document.getElementById('root'));
export default WrappedNormalLoginForm;
