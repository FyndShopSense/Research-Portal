import React, {Component} from "react";
import NavBar from "./navbar/NavBar.jsx";
import Footer from "./footer/Footer.jsx";
import "./Papers.css";
import constants from "../constants";
import axios from "axios";
import {Tag, Table, Button, Row, Col} from "antd";
import {Card} from "antd";
import {Layout, Menu, Breadcrumb, Icon} from "antd";
// import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

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
        )
    },
    {
        title: "Citations",
        dataIndex: "citationCount",
        render: (text) => (
            <Row>
                <p style={{textAlign: "center"}}>{text}</p>
            </Row>
        )
    },
    {
        title: "Year",
        dataIndex: "year",
        render: (text) => (
            <Row>
                <p style={{textAlign: "center"}}>{text}</p>
            </Row>
        )
    },
];


export class Papers extends Component {
    state = {
        data: [],
        authorData: {},
        paperLoading: false,
    };
    loadData = () => {
        this.setState({loading: true});
        axios
            .post(constants.flaskServerUrl + "account/details", {
                user_email: localStorage.getItem("user_email") || "",
            })
            .then((res) => {
                console.log(res.data);
                this.setState({authorData: res.data});
            })
            .catch((error) => {
                // console.log(error);
            });
    };

    componentDidMount() {
        this.loadData();
        this.setState({paperLoading: true});

        axios
            .get(
                constants.flaskServerUrl +
                "papers/author/id/" +
                localStorage.getItem("user_id")
            )
            .then((res) => {
                this.setState({paperLoading: false});
                // console.log(res.data.map(i=>i._source));
                this.setState({data: res.data.map((i) => i._source)});
                // console.log(
                //   res.data.map((i) => i._source.citationCount).reduce((x, y) => x + y)
                // );
            })
            .catch((err) => {
                this.setState({paperLoading: false});

                console.error(err);
            });
    }

    render() {
        let interestArr = IsJsonString(this.state.authorData.user_interests)
            ? JSON.parse(this.state.authorData.user_interests).interests
            : [];
        console.log(interestArr);
        return (
            <React.Fragment>
                <div className="navbar-outer-div">
                    <NavBar/>
                    <br/>
                </div>


                <Row style={{paddingTop: "90px", color: "#264653"}}>
                    <Col style={{paddingLeft: "60px"}} span={7}>
                        <div className="profile-main-outer-div">
                            <div style={{padding: "15px", marginLeft: "auto", marginRight: "auto"}}>
                                <div style={{textAlign: "center"}}>
                                    <h1> {localStorage.getItem("user_name")} </h1>

                                    <h3 style={{
                                        marginTop: "-7px",
                                        marginBottom: "15px"
                                    }}>{localStorage.getItem("user_institute")}</h3>


                                    {interestArr.length != 0 &&
                                    interestArr.map((i) => {
                                        return (
                                            <Tag style={{padding: "5px", borderRadius: "3px", marginBottom: "5px"}}>
                                                <a href={"http://localhost:3000/papers/?search=" + i}>{i}</a>
                                            </Tag>
                                        );
                                    })}

                                </div>

                                {/*<div className="papers-inner-right-div">*/}
                                <div style={{marginTop: "15px"}}>
                                    <Row className="summary-row" justify="space-between">
                                        <Col span={24}>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <Icon
                                                    type="bar-chart"
                                                    style={{
                                                        fontSize: "25px",
                                                        marginRight: "8px",
                                                        paddingBottom: "5px",
                                                    }}
                                                />
                                                <h4>
                                                    Publications:
                                                    {
                                                        this.state.data.length == 0 ? " 0" : " " + this.state.data.length
                                                    }
                                                </h4>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop: "5px"}} className="summary-row" justify="space-between">
                                        <Col span={24}>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <Icon
                                                    type="read"
                                                    style={{
                                                        fontSize: "25px",
                                                        marginRight: "8px",
                                                        paddingBottom: "5px",
                                                    }}
                                                />
                                                <h4>
                                                    Citations:{
                                                        this.state.data.length == 0 ? " 0" : " " + this.state.data
                                                            .map((i) => i.citationCount)
                                                            .reduce((x, y) => x + y)
                                                    }</h4>
                                            </div>
                                        </Col>
                                    </Row>

                                </div>
                            </div>
                        </div>


                    </Col>

                    <Col span={17}>

                        <div style={{width: "95%", marginLeft: "auto", marginRight: "auto", paddingRight: "60px"}}>
                            {/*<h1>Publications</h1>*/}
                            <Table
                                columns={columns}
                                dataSource={this.state.data}
                                loading={this.state.paperLoading}
                                bordered={true}
                            />

                        </div>
                    </Col>


                </Row>


                <Footer/>
            </React.Fragment>
        );
    }
}

export default Papers;
