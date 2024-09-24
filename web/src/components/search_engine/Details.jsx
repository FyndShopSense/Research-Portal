import React, { Component } from "react";
import "./Details.css";
// import queryString from "query-string";

import NavBar from "../navbar/NavBar.jsx";
import Footer from "../footer/Footer.jsx";

import { Skeleton, Icon } from "antd";
import constants from "../../constants";

import axios from "axios";

export class Details extends Component {
  state = {
    data: {},
    loading: true,
    referencesLoading: true,
    references: [],
    paperApiData: {},
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.setState({ referencesLoading: true });

    axios
      .get(
        constants.flaskServerUrl +
          "paper_details?id=" +
          this.props.match.params.id
      )
      .then((res) => {
        console.log(res.data.hits.hits[0]._source);
        this.setState({ data: res.data.hits.hits[0]._source });
        this.setState({ loading: false });
        // let referencesId = [
        //   "ac802376ee604d32ea6432f2781ef8b26ffaed13",
        //   "ac802376ee604d32ea6432f2781ef8b26ffaed13",
        //   "ac802376ee604d32ea6432f2781ef8b26ffaed13",
        //   "ac802376ee604d32ea6432f2781ef8b26ffaed13",
        // ];
        let referencesId = res.data.hits.hits[0]._source.outCitations;
        referencesId = referencesId.slice(0, 21);
        let referencesRequestArray = [];
        for (let i of referencesId) {
          // console.log(i);
          referencesRequestArray.push(
            axios.get(constants.flaskServerUrl + "paper_details?id=" + i)
          );
        }
        axios
          .all(referencesRequestArray)
          .then(
            axios.spread((...res1) => {
              this.setState({ referencesLoading: false });

              console.log(res1);
              let newreferences = [];
              for (let i in res1) {
                let data = res1[i];
                if (data.data.hits.hits.length == 0) {
                  continue;
                }
                newreferences.push({
                  ...data.data.hits.hits[0]._source,
                  id: referencesId[i],
                });
              }
              // console.log(newreferences);

              this.setState({ references: newreferences });
            })
          )
          .catch((err) => {
            this.setState({ referencesLoading: false });

            console.error(err);
          });
        // --------------------------------------------------
        axios
          .get(
            "https://api.semanticscholar.org/v1/paper/" +
              this.props.match.params.id
          )
          .then((res) => {
            console.log(res);
            this.setState({ paperApiData: res.data });
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <React.Fragment>
        <div className="navbar-outer-div">
          <NavBar />
        </div>
        <div className="details-outer-div">
          <div className="details-left-div">
            <div className="details-left-inner-div">
              {this.state.loading ? (
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 3, width: "100%" }}
                />
              ) : (
                <React.Fragment>
                  <h1>{this.state.data.title}</h1>
                  <span className="reference-info">
                    {this.state.data.venue}
                  </span>
                  <div className="details-page-date-description">
                    {/* <span>7 Pages -</span> */}
                    <span> Date Written: {this.state.data.year}</span>
                    <div
                      className="mobile-view-element"
                      style={{ marginTop: "10px" }}
                    >
                      <Icon
                        type="bar-chart"
                        className="paper-details-citation-icon"
                      />
                      Citations : {this.state.data.citationCount}
                      <div style={{ marginTop: "10px" }}>
                        <Icon
                          type="link"
                          className="paper-details-citation-icon"
                        />
                        References :{this.state.data.referenceCount}
                      </div>
                    </div>
                  </div>
                  <div>
                    {this.state.data.authors &&
                      this.state.data.authors.map((author) => (
                        <span
                          className="search-result-author"
                          key={author.name}
                        >
                          {author.name + ""}
                        </span>
                      ))}
                  </div>
                  <h2>Abstract</h2>
                  <p className="details-abstract">
                    {this.state.data.paperAbstract}
                  </p>
                  {this.state.data.fieldsOfStudy.length != 0 && (
                    <>
                      <h2>Fields Of Study</h2>
                      <div style={{ marginLeft: "-5px" }}>
                        {this.state.data.fieldsOfStudy.map((field) => (
                           <a href={"/papers/?search=" + field} target="_blank">
                          <span className="paper-topic">{field}</span></a>
                        ))}
                      </div>
                    </>
                  )}
                  {this.state.paperApiData.topics && this.state.paperApiData.topics.length!=0 && (
                    <>
                      <h2>Topics</h2>
                      <div style={{ marginLeft: "-5px" }}>
                        {this.state.paperApiData.topics.map((topic) => (
                          <a href={"/papers/?search=" + topic.topic} target="_blank">
                            <span className="paper-topic">{topic.topic}</span>
                          </a>
                        ))}
                      </div>
                    </>
                  )}

                  {this.state.data.pdfUrls &&
                  (this.state.data.pdfUrls.length > 0 ||
                    this.state.data.s2PdfUrl.length != 0) ? (
                    <a
                      href={
                        this.state.data.pdfUrls.length > 0
                          ? this.state.data.pdfUrls[0]
                          : this.state.data.s2PdfUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        className="mobile-view-element"
                        style={{
                          marginTop: "10px",
                          textAlign: "center",
                          border: "1px solid rgb(212, 212, 212)",
                          padding: "10px",
                        }}
                      >
                        <Icon
                          type="file-pdf"
                          style={{
                            color: "#1890ff",
                            fontSize: "17px",
                            marginRight: "5px",
                          }}
                        />
                        <span>View PDF</span>
                      </div>
                    </a>
                  ) : (
                    <span></span>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="details-right-div">
            <div className="details-right-paper-statistics">
              {this.state.loading ? (
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 1, width: "100%" }}
                />
              ) : (
                <React.Fragment>
                  <h2> Paper Statistics</h2>
                  CITATIONS
                  <div>
                    <Icon
                      type="bar-chart"
                      className="paper-details-citation-icon"
                    />
                    <span className="paper-details-citation-count">
                      {this.state.data.citationCount}
                    </span>
                  </div>
                  <div style={{ marginTop: "10px" }}></div>
                  {/* references */}
                  REFERENCES
                  <div>
                    <Icon type="link" className="paper-details-citation-icon" />
                    <span className="paper-details-citation-count">
                      {this.state.data.referenceCount}
                    </span>
                  </div>
                </React.Fragment>
              )}
            </div>
            {this.state.data.pdfUrls &&
            (this.state.data.pdfUrls.length > 0 ||
              this.state.data.s2PdfUrl.length != 0) ? (
              <a
                href={
                  this.state.data.pdfUrls.length > 0
                    ? this.state.data.pdfUrls[0]
                    : this.state.data.s2PdfUrl
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="details-open-pdf">
                  <Icon type="file-pdf" />
                  <span className="details-open-pdf-text">View PDF</span>
                </div>
              </a>
            ) : (
              <span></span>
            )}
          </div>
          <div style={{ clear: "both" }}></div>
          {this.state.data.outCitations != 0 && (
            <div className="details-references">
              <h1>References </h1>

              {this.state.referencesLoading ? (
                <div style={{ marginTop: "10px" }}>
                  <Skeleton
                    active
                    title={false}
                    paragraph={{ rows: 1, width: "100%" }}
                  />
                </div>
              ) : (
                <ol>
                  {this.state.references.map((reference, index) => (
                    <li key={index}>
                      <h1>
                        <a
                          href={"/paper-details/" + reference.id}
                          target="_blank"
                        >
                          {reference.title}
                        </a>
                      </h1>
                      <h2>
                        {reference.authors.map((author) => (
                          <span
                            className="search-result-author"
                            key={author.name}
                          >
                            {author.name + ""}
                          </span>
                        ))}
                        {" - "}
                        <span className="search-result-date">
                          {reference.year}
                        </span>
                      </h2>
                      {reference.paperAbstract.slice(0, 300)} ...
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
        <div style={{ clear: "both" }}></div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <br />
        {/* <Footer /> */}
      </React.Fragment>
    );
  }
}

export default Details;
