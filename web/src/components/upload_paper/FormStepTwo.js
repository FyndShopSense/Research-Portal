import React from "react";
import ReactDOM from "react-dom";
import {
    Form, Select, InputNumber, DatePicker, Switch, Radio, Slider, Button, Upload, Icon, Input, Rate, Checkbox, Row, Col
} from "antd";
import "./FormStep.css"

const {TextArea} = Input;
const {Option} = Select;


class Details extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form child: ", values);
                this.props.handleSecondFormSubmit(values);
            } else {
                window.scroll({top: 0, left: 0, behavior: 'smooth'})
            }
        });
    };

    state = {
        selectedOption: "Published Place's Name",
    };

    capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1)
    };

    handleChange = selectedOption => {
        selectedOption = this.capitalize(selectedOption) + "'s Name";
        this.setState({selectedOption: selectedOption});
        console.log(`Option selected:`, selectedOption);
    };

    normFile = e => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
            layout: 'vertical'
        };
        const config = {
            rules: [
                {type: "object", required: true, message: "Select Date of Publishing"}
            ]
        };
        return (
            <React.Fragment>
                <Form {...formItemLayout} onSubmit={this.handleSubmit} className="step-container">

                    <Form.Item label="Publication Type">
                        {getFieldDecorator("journalName", {
                            rules: [{required: true, message: "Enter Journal Name"}]
                        })(
                            <Select placeholder="Select Publication Type" onChange={this.handleChange}>
                                <Option value="journal">Journal</Option>
                                <Option value="conference">Conference</Option>
                                <Option value="chapter">Chapter</Option>
                                <Option value="book">Book</Option>
                                <Option value="Other">Other</Option>
                            </Select>
                        )}

                    </Form.Item>

                    <Form.Item label="Publication Date">
                        {getFieldDecorator("date-picker", config
                        )(
                            <DatePicker style={{width: "100%"}}/>
                        )}
                    </Form.Item>

                    <Form.Item label={this.state.selectedOption}>
                        {getFieldDecorator("publication_type_name", {
                            rules: [{required: true, message: "Enter Published Place's Name"}]
                        })(
                            <Input type="input" placeholder={"Enter " + this.state.selectedOption}/>
                        )}
                    </Form.Item>

                    <Form.Item label="Volume">
                        {getFieldDecorator("volume", {
                            rules: [
                                {message: "Enter Volume"}
                            ]
                        })(
                            <Input type="input" placeholder="Enter the Volume"/>
                        )}
                    </Form.Item>

                    <Form.Item label="Pages">
                        {getFieldDecorator("pages", {
                            rules: [
                                {message: "Enter the Pages"}
                            ]
                        })(
                            <Input type="input" placeholder="Enter the Pages"/>
                        )}
                    </Form.Item>


                    <Form.Item label="URL">
                        {getFieldDecorator("url", {
                            rules: [
                                {message: "Enter URL of published paper"}
                            ]
                        })(
                            <Input type="input" placeholder="Enter the url of published paper if any"/>
                        )}
                    </Form.Item>


                    <Form.Item label="Abstract">
                        {getFieldDecorator("abstract", {
                            rules: [{message: "Enter the Abstract"}]
                        })(
                            <TextArea placeholder="" rows={4}/>
                        )}
                    </Form.Item>

                    <Form.Item label="Upload Paper PDF">
                        {getFieldDecorator("paperupload", {
                            valuePropName: "fileList",
                            getValueFromEvent: this.normFile,
                            rules: [{message: "Upload your research Paper"}]
                        })(
                            <Upload.Dragger name="files" action="/upload.do">
                                <p className="ant-upload-drag-icon"><Icon type="inbox"/></p>
                                <p className="ant-upload-text"> Click or drag file to this area to upload</p>
                            </Upload.Dragger>
                        )}
                    </Form.Item>

                    <div style={{textAlign: "center", marginTop: "50px"}}>
                        <Button onClick={this.props.prev} style={{marginRight: "10px"}}> Previous </Button>
                        <Button type="primary" htmlType="submit" style={{marginLeft: "10px"}}> Next </Button>
                    </div>
                </Form>
            </React.Fragment>
        );
    }
}

const Second = Form.create({name: "validate_other"})(Details);
// ReactDOM.render(<Second/>, document.getElementById('root'));
export default Second;
