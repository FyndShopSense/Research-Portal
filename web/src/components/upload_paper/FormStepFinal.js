import React from "react";
import ReactDOM from "react-dom";
import {
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Icon,
  Input,
  Rate,
  Checkbox,
  Row,
  Col,
  message,
  Divider,
  AutoComplete,
} from "antd";
import "./FormStep.css";
import collegeList from "../../data/CollegeList";

const { TextArea } = Input;
const { Option } = Select;
{
  /* If DOI is not found in the database the user is asked to fill a form to upload the paper*/
}

class FormStepFinal extends React.Component {
  state = {
    authorArray: [0],
    collegeOptions: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        message.success("Processing complete!");
        let allFormData={...this.props.formData,...values}
        console.log(allFormData)
      } else {
        window.scroll({ top: 0, left: 0, behavior: "smooth" });
        message.error("Please complete filling the author details");
      }
    });
  };

  normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  add = () => {
    let arr = this.state.authorArray;
    arr.push(arr[arr.length - 1] + 1);
    this.setState({ authorArray: arr });
  };

  remove = (key) => {
    var value = key;

    var arr = this.state.authorArray;

    arr = arr.filter(function (item) {
      return item !== value;
    });
    this.setState({ authorArray: arr });
  };

  handleSearch = (searchText) => {
    // this.setState({collegeOptions:value ? this.searchResult(value) : []})
    this.setState({ collegeOptions: this.searchResult(searchText) });
  };
  searchResult = (query) => {
    return collegeList.filter((collge) => {
      return collge.toLowerCase().includes(query.toLocaleLowerCase());
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      layout: "vertical",
    };
    const config = {
      rules: [
        { type: "object", required: true, message: "Please select time!" },
      ],
    };
    return (
      <Form
        {...formItemLayout}
        onSubmit={this.handleSubmit}
        className="step-container"
      >
        {this.state.authorArray.map((num) => (
          <React.Fragment>
            {num > 0 ? (
              <Divider orientation="right">
                {/* <Icon
                  // style={{float:"right",marginRight:"50px"}}
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(num)}
                /> */}
                <Icon
                  type="close-circle"
                  className="dynamic-delete-button"
                  onClick={() => this.remove(num)}
                />
              </Divider>
            ) : null}

            <div>
              <Form.Item label="Author Name">
                {getFieldDecorator(`authorname[${num}]`, {
                  rules: [{ required: true, message: "Enter Author Name" }],
                })(<Input type="input" placeholder="Author Name" />)}
              </Form.Item>

              <Form.Item label="University">
                {getFieldDecorator(`college[${num}]`, {
                  rules: [
                    { required: true, message: "Enter College/Affiliation" },
                  ],
                })(
                  // <Input type="input" placeholder="Enter College or Affiliation"/>
                  <AutoComplete
                    dataSource={this.state.collegeOptions}
                    // onSelect={onSelect}
                    onSearch={this.handleSearch}
                  >
                    <Input.Search
                      size="large"
                      placeholder="Enter College or Affiliation"
                    />
                  </AutoComplete>
                  // <Select  placeholder="Enter College or Affiliation" showSearch >
                  // {collegeList.map((college,index) => {
                  //   return <Option value={college} key={index}>{college}</Option>;
                  // })}
                  // </Select>
                )}
              </Form.Item>

              <Form.Item label="Email">
                {getFieldDecorator(`email[${num}]`, {
                  rules: [
                    { required: true, message: "Enter Email", type: "email" },
                  ],
                })(<Input type="email" placeholder="Enter Email" />)}
              </Form.Item>
            </div>
          </React.Fragment>
        ))}
        <Button type="dashed" onClick={this.add} style={{ width: "100%" }}>
          <Icon type="plus" /> Add Author
        </Button>

        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Button onClick={this.props.prev} style={{ marginRight: "10px" }}>
            Previous
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "10px" }}
          >
            Done
          </Button>
        </div>
      </Form>
    );
  }
}

const Third = Form.create({ name: "third_form" })(FormStepFinal);
// ReactDOM.render(<Third/>, document.getElementById('root'));
export default Third;
