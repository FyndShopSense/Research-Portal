import React from "react";
// import './welc.css'
import {Button, Form, Input} from "antd";
import ReactDOM from "react-dom";

import NavBar from "../navbar/NavBar.jsx";
import Footer from "../footer/Footer";

class ResetForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log("Received values of form: ", values);
            }
        });
    };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        <div className="navbar-outer-div">
          <NavBar />
        </div>
        <Form
          onSubmit={this.handleSubmit}
          className="login-form"
          style={{ width: "20%", margin: "auto", paddingTop: "19%" }}
        >
          <Form.Item>
            {getFieldDecorator("New Password", {
              rules: [{ required: true, message: "Please enter new password" }]
            })(<Input placeholder="Enter New Password" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("Confirm Password", {
              rules: [
                { required: true, message: "Please confirm your new password" }
              ]
            })(<Input placeholder="Confirm New Password" />)}
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: "100%" }}
          >
            Submit
          </Button>
        </Form>
        <div className="home-footer">
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}
const WrappedNormalResetForm = Form.create({ name: "normal_login" })(ResetForm);
// ReactDOM.render(<WrappedNormalResetForm/>, document.getElementById('root'));
export default WrappedNormalResetForm;
