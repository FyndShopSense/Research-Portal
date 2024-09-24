import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Descriptions, Badge, Input, Select, Divider, Typography } from "antd";
import { Table, InputNumber, Popconfirm, Form } from "antd";
import constants from "../../constants";

import axios from "axios";
// const data = [];
// let apiResponse = [];
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i.toString(),
//     login: `Name- Session ${i} Location`
//   });
// }

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

const EditableContext = React.createContext();

const selectBefore = (
  <Select defaultValue="Filters" style={{ width: 200 }}>
    <Option value="yesterdays-activity">Yesterderday's Activity</Option>
    <Option value="repository-management">Repository Management</Option>
  </Select>
);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: "" };
    this.columns = [
      {
        title: "Recent Events",
        dataIndex: "login",
        width: "25%",
        editable: true,
      },
    ];
  }
  componentDidMount = () => {
    axios
      .post(constants.flaskServerUrl + `security-logs/`, {
        user_id: "12313",
      })
      .then((res) => {
        // console.log(res.data);
        let apiResponse = [];
        for (let i in res.data) {
          // console.log(i);
          apiResponse.push({
            key: i.toString(),
            login:
              "ID: " +
              res.data[i]["user_id"] +
              " IP: " +
              res.data[i]["ip"] +
              " device: " +
              res.data[i]["device"]+
              " time: " +
              res.data[i]["time"],
            // login: `Name- Session ${i} Location`,
          });
        }
        this.setState({ data: apiResponse });
      })
      .catch((err) => console.error(err));
  };

  isEditing = (record) => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

class Log extends React.Component {
  render() {
    return (
      <Typography>
        <Title level={2}>Security Log</Title>
        <Divider />
        <Descriptions title="" bordered>
          <Descriptions.Item label="Current Status" span={3}>
            <Badge status="processing" text="Online" />
          </Descriptions.Item>
        </Descriptions>
        <br />
        <div>
          <div style={{ marginBottom: 16 }}>
            <Input
              addonBefore={selectBefore}
              defaultValue="Search your security log"
            />
          </div>
        </div>
        <br />
        <EditableFormTable />
      </Typography>
    );
  }
}

export default Log;
