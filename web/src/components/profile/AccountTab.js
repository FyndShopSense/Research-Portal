import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import {
  Typography,
  Divider,
  Button,
  Radio,
  Modal,
  Form,
  Icon,
  Input,
  message,
} from "antd";

import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const { confirm } = Modal;

class Account extends React.Component {
  state = {
    loading: false,
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log("Received values of form: ", values);
        if (values["e-mail address"]) {
          this.setState({ loading: true });
          setTimeout(() => {
            message.success("Your email address has been changed successfully.");
            this.setState({ loading: false, visible: false });
          }, 1000);
        }
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  showDeleteConfirm() {
    confirm({
      okText: "Yes",
      title: "Are you sure you want to delete your account?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Once you confirm, all of your account data will be permanently deleted",
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  }
  showPassChangeConfirm = () => {
    let callshowModal = this.showModal;
    confirm({
      okText: "Yes",
      title: "Are you sure you want to change your Email?",
      icon: <ExclamationCircleOutlined />,
      // content: 'Once you confirm, all of your account data will be permanently deleted',
      onOk() {
        // return new Promise((resolve, reject) => {
        //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        // }).catch(() => console.log("Oops errors!"));
        callshowModal();
      },
      onCancel() {},
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, loading } = this.state;
    return (
      <div>
        <Modal
          visible={visible}
          title="Enter new email address"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
            >
              Submit
            </Button>,
          ]}
        >
          <Form >
            <Form.Item>
              {getFieldDecorator("e-mail address", {
                rules: [
                  {
                    required: true,
                    message: "Please enter your E-mail Address!",
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="E-mail address"
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Typography>
          <Title level={2}>Change E-mail</Title>
          <Paragraph>
            Changing your E-mail can have unintended side effects.
          </Paragraph>
          <Button type="primary" onClick={this.showPassChangeConfirm}>
            Change E-mail
          </Button>
          <Divider />

          {/* <Title level={2}>Mobile settings</Title> */}
          {/* <Radio>
            <b>Opt out of mobile pages</b>
          </Radio>
          <Paragraph>
            This will cause all your sessions and devices to only experience the
            desktop site for all pages. Pages designed to be responsive will
            still scale down properly.
          </Paragraph>
          <Button type="primary" >
            Update Mobile Settings
          </Button>
          <Divider /> */}
          <Title level={2}>
          <font color="red">Delete Account</font>
          </Title>
          <Paragraph>
            Once you delete your account, there is no going back. Please be
            certain.
          </Paragraph>
          <Button type="danger" onClick={this.showDeleteConfirm}>
            Delete account
          </Button>
          <Divider />
        </Typography>
      </div>
    );
  }
}
const WrappedNormalForgotForm = Form.create({ name: "account" })(Account);
export default WrappedNormalForgotForm;
