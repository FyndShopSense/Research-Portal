import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Icon,
  Descriptions,
  Badge,
  Typography,
  Tooltip,
  AutoComplete,
  Checkbox,
  Skeleton,
} from "antd";

import axios from "axios";
import constants from "../../constants";

const { Title, Paragraph, Text } = Typography;

const { Option } = Select;

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const selectBefore = (
  <Select defaultValue="Http://" style={{ width: 90 }}>
    <Option value="Http://">Http://</Option>
    <Option value="Https://">Https://</Option>
  </Select>
);
const selectAfter = (
  <Select defaultValue=".com" style={{ width: 80 }}>
    <Option value=".com">.com</Option>
    <Option value=".jp">.jp</Option>
    <Option value=".cn">.cn</Option>
    <Option value=".org">.org</Option>
  </Select>
);

const { TextArea } = Input;

const onChange = (e) => {
  // console.log(e);
};

// import 'antd/dist/antd.css';
// import {
//   Form,
//   Input,
//   Tooltip,
//   Icon,
//   Cascader,
//   Select,
//   Row,
//   Col,
//   Checkbox,
//   Button,
//   AutoComplete,
// } from 'antd';

const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    initialData: {},
    loading: true,
    updateLoading: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let updatedName = values.name;
        // console.log("Received values of form: ", values);
        let requestBody = {
          name: values.name,
          // password: values.password,
          email: localStorage.getItem("user_email") || "",
          institute: values.institute,
          city: values.city,
          phone_number: values.phone || "",
          homepage: values.homepage || "",
          interests: JSON.stringify({ interests: values.areaOfInterest }) || "",
        };
        console.log(requestBody);
        this.setState({ updateLoading: true });

        axios
          .post(constants.flaskServerUrl + "profile/update", requestBody)
          .then((res) => {
            console.log(res);
            this.loadData();
            localStorage.setItem("user_name", updatedName);
            this.setState({ updateLoading: false });
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
            this.setState({ updateLoading: false });
          });
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
      callback("Two passwords that you enter is inconsistent!");
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

  handleHomepageChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = [".com", ".org", ".net"].map(
        (domain) => `${value}${domain}`
      );
    }
    this.setState({ autoCompleteResult });
  };
  loadData = () => {
    this.setState({ loading: true });
    axios
      .post(constants.flaskServerUrl + "account/details", {
        user_email: localStorage.getItem("user_email") || "",
      })
      .then((res) => {
        console.log(res.data);
        this.setState({ initialData: res.data });
        this.setState({ loading: false });
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  };
  componentDidMount() {
    this.loadData();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "91",
    })(
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
      </Select>
    );
    const onChange = (e) => {
      // console.log(e);
    };

    const homepageOptions = autoCompleteResult.map((homepage) => (
      <AutoCompleteOption key={homepage}>{homepage}</AutoCompleteOption>
    ));

    return (
      //   <React.Fragment>
      <div
        style={{
          width: "80%",
          // margin:"auto",
          // boxShadow:'0'
          // box-shadow: 0 1px 6px 0 rgba(32,33,36,0.28);
          // border= '10px',
          // padding: '50px',
          paddingTop: "10px",
          paddingLeft: "20px",
        }}
      >
        {/* <h1 className="registration-title">Cree your account</h1> */}
        {this.state.loading ? (
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 1, width: "100%" }}
          />
        ) : (
          <Form
            onSubmit={this.handleSubmit}
            layout="vertical"
            hideRequiredMark={true}
          >
            <Form.Item
              label={
                <span>
                  Name&nbsp;
                  <Tooltip title="Full Name as it appears on your research papers">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("name", {
                initialValue: this.state.initialData.user_name || "",
                rules: [
                  {
                    required: true,
                    message: "Please input your Full Name.",
                    whitespace: true,
                  },
                ],
              })(<Input placeholder="Enter your full name" />)}
            </Form.Item>
            {/* <Form.Item label="E-mail">
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                      {
                        required: true,
                        message: 'Please input your E-mail Address',
                      },
                    ],
                  })(<Input placeholder="Enter your Email Address" />)}
                </Form.Item> */}
            {/* <Form.Item label="Password" hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input.Password placeholder="Enter your password"/>)}
                </Form.Item> */}
            {/* <Form.Item label="Confirm Password" hasFeedback>
                  {getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="Confirm your Password"/>)}
                </Form.Item> */}
            <Form.Item
              label={
                <span>
                  Institute&nbsp;
                  <Tooltip title="E.g., DEPSTAR, Charusat University">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("institute", {
                initialValue: this.state.initialData.user_institute || "",
                rules: [
                  {
                    required: true,
                    message: "Please input your Institute name",
                    whitespace: true,
                  },
                ],
              })(<Input placeholder="Provide your Institute Name" />)}
            </Form.Item>

            {/*Area of Interest*/}
            <Form.Item
              label={
                <span>
                  Area of Interest&nbsp;
                  <Tooltip title="E.g., Machine Learning, Aerospace, Data Analytics">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("areaOfInterest", {
                // initialValue: JSON.parse( this.state.initialData.user_interests).interests || "",
                initialValue: IsJsonString(
                  this.state.initialData.user_interests
                )
                  ? JSON.parse(this.state.initialData.user_interests).interests
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: "Please enter your area of Interest",
                  },
                ],
              })(
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Enter your area of Interests"
                  required
                ></Select>
              )}
            </Form.Item>

            <Form.Item label="City">
              {getFieldDecorator("city", {
                initialValue: this.state.initialData.user_city || "",
                rules: [
                  {
                    required: true,
                    message: "Please input the city",
                    whitespace: true,
                  },
                ],
              })(<Input placeholder="Enter your city" />)}
            </Form.Item>

            <Form.Item label="Homepage">
              {getFieldDecorator("homepage", {
                initialValue: this.state.initialData.user_homepage || "",
                rules: [
                  { required: false, message: "Please enter your website" },
                ],
              })(
                <AutoComplete
                  dataSource={homepageOptions}
                  onChange={this.handleHomepageChange}
                  placeholder="E.g. http://www.charusatuniversity/~research_portal"
                >
                  <Input />
                </AutoComplete>
              )}
            </Form.Item>
            {/* 
            <Form.Item size="large" label="Bio">
              <TextArea
                placeholder="Write about yourself"
                allowClear
                onChange={onChange}
              />
            </Form.Item> */}

            <Form.Item label="Phone Number">
              {getFieldDecorator("phone", {
                initialValue: this.state.initialData.user_phone_number || "",
                rules: [
                  {
                    required: false,
                    message: "Please input your phone number!",
                  },
                ],
              })(
                <Input
                  placeholder=""
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                />
              )}
            </Form.Item>
            {/* <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                    <Row gutter={8}>
                      <Col span={12}>
                        {getFieldDecorator('captcha', {
                          rules: [{ required: true, message: 'Please input the captcha you got!' }],
                        })(<Input />)}
                      </Col>
                      <Col span={12}>
                        <Button>Get captcha</Button>
                      </Col>
                    </Row>
                  </Form.Item> */}
            {/* <Form.Item {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                      valuePropName: 'checked',
                    })(
                      <Checkbox>
                        I agree with <a href="">Terms & Conditions</a>
                      </Checkbox>,
                    )}
                  </Form.Item> */}
            {/* <Form.Item
              {...tailFormItemLayout}
              className="registration-register-button"
            >
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item> */}
            <div
              style={{
                width: "100%",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.updateLoading}
              >
                Update
              </Button>
            </div>
          </Form>
        )}

        {/* <div className="home-footer"> */}
        {/* </div> */}
      </div>
      //   </React.Fragment>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "register" })(
  RegistrationForm
);

class Info extends React.Component {
  render() {
    return (
      <div>
        {/* <Form layout='vertical'> */}
        <Title level={2}>Profile</Title>
        <WrappedRegistrationForm />
        {/* <Form.Item label="Name" >
                        <Input placeholder="First-Last Name" />
                    </Form.Item>
                    <Form.Item label="Public Email">
                        <Input placeholder="Existing_user@email.com" />
                    </Form.Item>
                    <Form.Item label="Affiliation">
                        <Input placeholder="Existing Affiliation" />
                    </Form.Item>
                    <Form.Item size="large" label="Bio">
                        <TextArea placeholder="" allowClear onChange={onChange} />
                    </Form.Item>
                    <Form.Item label="URL">
                        <div>
                            <div style={{ marginBottom: 16 }}>
                                <Input addonBefore={selectBefore} addonAfter={selectAfter} defaultValue="mysite" />
                            </div>
                        </div>
                    </Form.Item>
                    <Form.Item label="Location">
                        <Input placeholder="India" />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary">Update</Button>
                    </Form.Item>
                </Form> */}
      </div>
    );
  }
  /*render() {
        return (
            <Descriptions title="User Profile" layout="horizontal" bordered>
                <Descriptions.Item label="Name" span={3}>First-Name Last-Name</Descriptions.Item>
                <Descriptions.Item label="Billing Mode" span={3}>Prepaid</Descriptions.Item>
                <Descriptions.Item label="Status" span={3}>
                    <Badge status="processing" text="Online" />
                </Descriptions.Item>
            </Descriptions>
        );
    }*/
}
export default Info;
