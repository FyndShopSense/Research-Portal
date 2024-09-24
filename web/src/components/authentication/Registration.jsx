import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./Registration.css";

import NavBar from "../navbar/NavBar.jsx";
import Footer from "../footer/Footer";

import "antd/dist/antd.css";
import { message } from "antd";

import {
  Form,
  Input,
  Tooltip,
  Icon,
  Select,
  Checkbox,
  Button,
  AutoComplete,
} from "antd";

import constants from "../../constants";

import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const { Option } = Select;
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    tags: [],
    loading: false,
  };
  handleDelete = (i) => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  };

  handleAddition = (tag) => {
    this.setState((state) => ({ tags: [...state.tags, tag] }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        var interest_tags = [];
        for (var tag in this.state.tags) {
          interest_tags.push(this.state.tags[tag]["text"]);
        }
        var interests = { interests: interest_tags };
        interests = JSON.stringify(interests);

        axios
          .post(constants.flaskServerUrl + "registration/", {
            name: values.name,
            password: values.password,
            email: values.email,
            institute: values.institute,
            city: values.city,
            phone_number: values.phone || "",
            homepage: values.homepage || "",
            interests: interests || "",
          })
          .then((res) => {
            message.success(res.data);
            this.setState({ loading: false });
            // console.log(res);
            // console.log(res.data);
            this.props.history.push("/claim-papers");
            axios
              .post(constants.flaskServerUrl + "login/", {
                user_email: values.email,
                password: values.password,
              })
              .then((res2) => {
                console.log(res2);
                this.setState({ loading: false });
                message.success(
                  "Login successful. Redirecting you to homepage..."
                );
                // localStorage.setItem('login-data', JSON.stringify(res.config.data));
                localStorage.setItem("login-data", true);
                localStorage.setItem("user_email", values.email);
                localStorage.setItem("user_name", res2.data.user_name);
                localStorage.setItem("user_id", res2.data.user_id);
                localStorage.setItem(
                  "user_institute",
                  res2.data.user_institute
                );

                this.props.history.push("/claim-papers");
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            if (error.response) {
              this.setState({ loading: false });
              // message.error(error.response.data);
              // console.log(error && error.response);
              message.error("Please try again");

              // console.log(error.response.status);
              // console.log(error.response.headers);
            }
          });
        // console.log("Received values of form: ", values);
      } else {
        window.scroll({ top: 0, left: 0, behavior: "smooth" });
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Passwords do not match, try again!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const prefixSelector = getFieldDecorator("prefix", { initialValue: "91" })(
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
      </Select>
    );

    return (
      <React.Fragment>
        <div className="navbar-outer-div">
          <NavBar />
        </div>

        <div style={{ paddingTop: "90px" }}></div>

        <div className="registration-container">
          <h1 className="registration-title">Create your account</h1>

          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              label={
                <span>
                  Name
                  <Tooltip title="Full Name as it appears on your research papers">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input your Full Name.",
                    whitespace: true,
                  },
                ],
              })(<Input placeholder="Enter your full name" name="fname" />)}
            </Form.Item>

            <Form.Item label="E-mail">
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                  {
                    required: true,
                    message: "Please input your email address",
                  },
                ],
              })(<Input placeholder="Enter your Email Address" name="email" />)}
            </Form.Item>

            <Form.Item label="Password" hasFeedback>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(
                <Input.Password
                  placeholder="Enter your password"
                  name="password"
                />
              )}
            </Form.Item>

            <Form.Item label="Confirm Password" hasFeedback>
              {getFieldDecorator("confirm", {
                rules: [
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(
                <Input.Password
                  onBlur={this.handleConfirmBlur}
                  placeholder="Confirm your Password"
                  name="cpass"
                />
              )}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Institute / Affiliation
                  <Tooltip title="E.g., Anna University, PES University etc">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("institute", {
                rules: [
                  {
                    required: true,
                    message: "Please input your Institute name",
                    whitespace: true,
                  },
                ],
              })(
                <Input
                  placeholder="Provide your Institute Name"
                  name="institute"
                />
              )}
            </Form.Item>

            <Form.Item label="City">
              {getFieldDecorator("city", {
                rules: [
                  {
                    required: true,
                    message: "Please input the city",
                    whitespace: true,
                  },
                ],
              })(<Input placeholder="Enter your city" name="city" />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Home Page
                  <Tooltip title="E.g., http://xyz.abc or https://xyz.abc">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("homepage", {
                rules: [
                  { required: false, message: "Please enter your Website" },
                  {
                    pattern: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
                    message: "Please enter a valid URL",
                    whitespace: false,
                  },
                ],
              })(<Input placeholder="Enter your Website" name="hp" />)}
            </Form.Item>

            <Form.Item label="Phone Number">
              {getFieldDecorator("phone", {
                rules: [
                  {
                    required: false,
                    message: "Please input your phone number!",
                  },
                  {
                    // type: "number",

                    pattern: /^\d{10}$/,
                    message: "Please enter a valid Phone Number",
                    len: 10,
                    whitespace: false,
                  },
                ],
              })(
                <Input
                  placeholder="Enter your phone number"
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  name="phone_number"
                />
              )}
            </Form.Item>
            <div>Interests :</div>
            <ReactTags
              inputFieldPosition="bottom"
              placeholder="Add Interests (Press enter to add tag)"
              inline={true}
              allowDragDrop={false}
              tags={this.state.tags}
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              handleDrag={this.handleDrag}
              delimiters={delimiters}
            />

            <Form.Item className="registration-register-button">
              <Button
                className="registration-button"
                block
                type="primary"
                htmlType="submit"
                style={{ marginTop: 20 }}
                loading={this.state.loading}
              >
                Register
              </Button>

              <p disabled>
                {" "}
                By creating an account, you agree to the Terms of Service.
              </p>
            </Form.Item>
          </Form>
        </div>

        <Footer />
      </React.Fragment>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "register" })(
  RegistrationForm
);

export default WrappedRegistrationForm;
