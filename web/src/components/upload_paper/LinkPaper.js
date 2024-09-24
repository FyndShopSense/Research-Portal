import React, {Component} from "react";
import {Steps, Button, Form, message, Divider, Table, Row, Col} from "antd";
import constants from "../../constants";
import axios from "axios";
import NavBar from "../navbar/NavBar.jsx";
import Footer from "../footer/Footer";
import "./LinkPaper.css";

// const columns = [
//   {
//     title: "Title",
//     dataIndex: "title",
//     render: (text) => text,
//   },
//   {
//     title: "year",
//     dataIndex: "year",
//   },
// ];

const columns = [
    {
        title: "Publications",
        dataIndex: "title",
        render: (text, record) => (
            <Row>
                <p className="search-result-title"><a href={"http://localhost:3000/paper-details/" + record.id}><span
                    style={{fontSize: "16px"}}> {text}</span></a></p>
                {/*{console.log(record.authors)}*/}
                {record.authors.map(
                    (author, index) => {
                        return <span className="search-result-author">{(index ? ', ' : '') + author.name.trim()}</span>
                    }
                )}

                {/*<p style={{marginTop: "10px"}}>{record.authors.name}</p>*/}
                <p className="search-result-journal-name">{record.journalName}</p>
            </Row>
        ),
        //   sorter: {
        //   compare: (a, b) => a.title - b.title,
        //   multiple: 3,
        // },
    },
    {
        title: "Citations",
        dataIndex: "citationCount",
        render: (text) => (
            <Row>
                <p style={{textAlign: "center"}}>{text}</p>
            </Row>
        ),
        //   sorter: {
        //   compare: (a, b) => a.citationCount - b.citationCount,
        //   multiple: 2,
        // },
    },
    {
        title: "Year",
        dataIndex: "year",
        defaultSortOrder: 'descend',

        render: (text) => (
            <Row>
                <p style={{textAlign: "center"}}>{text}</p>
            </Row>
        ),
        // sorter: {
        // compare: (a, b) => parseInt(a.year) - parseInt(b.year),
        // multiple: 1,
        // },
    },
];


export class LinkPaper extends Component {
    state = {
        loading: false,
        data: [],
        selectedIds: [],
        linkLoading: false,
    };
    loadData = () => {
        this.setState({loading: true});
        axios
            // .get(constants.flaskServerUrl + "papers/author/name/Amit Ganatra")
            .get(
                constants.flaskServerUrl +
                "papers/author/name/" +
                localStorage.getItem("user_name") || ""
            )
            .then((res) => {
                this.setState({loading: false});

                console.log(res.data.map((i) => i));
                this.setState({
                    data: res.data.map((i) => ({...i._source, id: i._id})),
                });
            })
            .catch((err) => {
                this.setState({loading: false});
                console.error(err);
            });
    };

    componentDidMount() {
        this.loadData();
    }

    handleLink = () => {
        this.setState({linkLoading: true});

        axios
            .post(
                constants.flaskServerUrl +
                "users/" +
                localStorage.getItem("user_id") +
                "/link/",
                {
                    paper_ids: this.state.selectedIds,
                    author_name: localStorage.getItem("user_name") || "",
                    author_institution: localStorage.getItem("user_institute"),
                }
            )
            .then((res) => {
                console.log(res);
                this.setState({linkLoading: false});
                message.success(
                    "Papers have been linked with your account successfully."
                );
                this.props.history.push(
                    "/author/" +
                    localStorage.getItem("user_name").replace(/\s+/g, "-") +
                    "/" +
                    localStorage.getItem("user_id")
                );
                window.scroll({top: 0, left: 0, behavior: "smooth"});

            })
            .catch((error) => {
                this.setState({linkLoading: false});

                console.log(error);
            });
    };
    handleCancel = () => {
        this.props.history.push("/");
    };
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(
            //   `selectedRowKeys: ${selectedRowKeys}`,
            //   "selectedRows: ",
            //   selectedRows
            // );
            console.log(selectedRows.map((i) => i.id));
            this.setState({selectedIds: selectedRows.map((i) => i.id)});
        },
    };

    render() {
        return (
            <>
                <div className="navbar-outer-div">
                    <NavBar/>
                </div>
                <div style={{paddingTop: "90px"}}></div>

                <div style={{width: "70%"}} className="login-form step-outer-container link-paper">
                    <Row>
                        <Col span={14}>
                            <h1>Claim your Research Papers</h1>
                        </Col>
                        <Col span={10}>
                            <div style={{textAlign: "right"}}>
                                <Button
                                    type="primary"
                                    style={{margin: "10px"}}
                                    onClick={this.handleLink}
                                    loading={this.state.linkLoading}
                                >
                                    Claim Papers
                                </Button>
                                <Button style={{margin: "10px"}} onClick={this.handleCancel}>
                                    Do it later
                                </Button>
                            </div>
                        </Col>

                    </Row>
                    Ensure your research is discoverable on our platform. Claiming your
                    research papers allows you to showcase your research work on your
                    author page. You can select all the papers that belong to you that you
                    want to claim as your work
                    <br/>
                    <br/>
                    <Table
                        loading={this.state.loading}
                        rowSelection={this.rowSelection}
                        columns={columns}
                        dataSource={this.state.data}
                        bordered={true}
                    />
                    {/*    <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              style={{ margin: "10px" }}
              onClick={this.handleLink}
              loading={this.state.linkLoading}
            >
              Claim Papers
            </Button>
            <Button style={{ margin: "10px" }} onClick={this.handleCancel}>
              Do it later
            </Button>
          </div>*/}
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <Footer/>
            </>
        );
    }
}

export default LinkPaper;
