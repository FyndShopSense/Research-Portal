import React, { Component } from "react";

import ReactDOM from "react-dom";
import { withRouter, Link } from "react-router-dom";
import queryString from "query-string";
import NavBar from "../navbar/NavBar.jsx";
import Footer from "../footer/Footer";

import "./SearchResult.css";
import constants from "../../constants";

import {
  ReactiveBase,
  DataSearch,
  MultiList,
  SelectedFilters,
  ReactiveList,
  DynamicRangeSlider,
  ResultList,
  SingleList,
  TagCloud,
} from "@appbaseio/reactivesearch";
import { Row, Button, Col, Card, Switch, Tree, Popover, Affix } from "antd";
import { Skeleton, Icon } from "antd";
import "antd/dist/antd.css";

class SearchResult extends Component {
  state = {
    YOPLower: Number,
    YOPUpper: Number,
    // SearchValue: queryString.parse(this.props.location.search).search,
    data: {},
  };
  // onSearchValueChange = value => {
  //     console.log(value);
  //     this.setState({SearchValue: value});
  // };
  handleShowText = (id) => {
    document.getElementById(id + "text").style.display = "inline";
    document.getElementById(id + "more-button").style.display = "none";
    document.getElementById(id + "less-button").style.display = "inline";
  };
  handleHideText = (id) => {
    document.getElementById(id + "text").style.display = "none";
    document.getElementById(id + "more-button").style.display = "inline";
    document.getElementById(id + "less-button").style.display = "none";
  };
  /* handleKey = (e, triggerQuery) => {
         console.log(e);
         if (e.key === "Enter") {
             // window.history.pushState("object or string", "Page Title", "/search?q="+this.state.SearchValue);
             // console.log("sndbfsd",window.location.href)
             // triggerQuery();
         }
     };*/
  showFilters = () => {
    // document.getElementById("search-result-filters-id").style.height = "100%";
    document
      .getElementById("search-result-filters-id")
      .classList.add("search-result-filters-open");
    document
      .getElementById("search-result-filters-id")
      .classList.remove("search-result-filters-close");
    document.getElementById("search-result-filters-id").style.marginTop =
      "10px";
    document.getElementById("search-result-filters-id").style.marginBottom =
      "10px";
    document.getElementById("filters-show-button").style.display = "none";
    document.getElementById("filters-hide-button").style.display = "block";
  };
  hideFilters = () => {
    // document.getElementById("search-result-filters-id").style.height = "0px";
    document
      .getElementById("search-result-filters-id")
      .classList.add("search-result-filters-close");
    document
      .getElementById("search-result-filters-id")
      .classList.remove("search-result-filters-open");
    document.getElementById("search-result-filters-id").style.marginTop =
      "20px";
    document.getElementById("search-result-filters-id").style.marginBottom =
      "0px";
    document.getElementById("filters-show-button").style.display = "block";
    document.getElementById("filters-hide-button").style.display = "none";
  };

  render() {
    // console.log(queryString.parse(this.props.location.search));

    return (
      <React.Fragment>
        <div className="navbar-outer-div">
          <NavBar />
        </div>
        <div className="result-filter-outer-div">
          <ReactiveBase
            url={constants.elasticSearchUrl}
            app={constants.elasticSearchAppName}
            // app="research-portal-sih"
            // credentials="VOZZl4GlJ:1266ec5f-f4e5-46af-83ce-70b1af2eb686"
            // url="https://scalr.api.appbase.io"
            // analytics={false}
            // searchStateHeader
          >
            <div className="result-search-bar">
              <Row
                gutter={16}
                // style={{ padding: 20 ,paddingLeft:110,paddingRight:110}}
              >
                <DataSearch
                  componentId="search"
                  // onValueChange={this.onSearchValueChange}
                  // onKeyDown={this.handleKey}
                  // value={this.state.SearchValue}
                  defaultValue={
                    queryString.parse(this.props.location.search).search
                  }
                  dataField={[
                    "authors.name",
                    "authors.name.autosuggest",
                    "authors.name.english",
                    "authors.name.keyword",
                    "authors.name.search",
                    "doi",
                    "doi.autosuggest",
                    "doi.english",
                    "doi.search",
                    "journalName",
                    "journalName.autosuggest",
                    "journalName.english",
                    "journalName.keyword",
                    "journalName.search",
                    "title",
                    "title.autosuggest",
                    "title.english",
                    "title.search",
                    "fieldsOfStudy",
                    "authors.author_institution",
                  ]}
                  fieldWeights={[
                    90,
                    90,
                    90,
                    90,
                    1,
                    1,
                    1,
                    1,
                    1,
                    10,
                    1,
                    1,
                    1,
                    1,
                    60,
                    1,
                    1,
                    1,
                    10,
                    10,
                  ]}
                  fuzziness={1}
                  highlight={false}
                  highlightField={[]}
                  placeholder="Search for research papers"
                  queryFormat="or"
                  style={{
                    marginBottom: 20,
                  }}
                  title="Find papers from all fields of science"
                  showClear={true}
                  size={5}
                  URLParams={true}
                />
              </Row>
            </div>
            <Row
              gutter={16}
              // style={{ padding: 100, paddingTop: 20 }}
            >
              <div
                onClick={this.showFilters}
                id="filters-show-button"
                className="filters-show-hide-buttons"
              >
                Filters <Icon type="down" />
              </div>
              <div
                onClick={this.hideFilters}
                id="filters-hide-button"
                className="filters-show-hide-buttons"
              >
                Filters <Icon type="up" />
              </div>
              <div
                className="search-result-filters"
                id="search-result-filters-id"
              >
                <Card>
                  {/* TODO: Keep the starting year fixed but change the intermediate year only*/}
                  {/* TODO: Bug: If there is only one search result timeline doesnt show */}
                  <DynamicRangeSlider
                    loader={
                      <Skeleton
                        active
                        title={false}
                        paragraph={{ rows: 1, width: "100%" }}
                      />
                    }
                    // value={2000}
                    componentId="publication-year"
                    dataField="year"
                    title="Year of Publication"
                    defaultValue={(min, max) => ({
                      start: min,
                      end: 2020,
                    })}
                    rangeLabels={(min, max) => ({
                      start: min,
                      end: 2020,
                    })}
                    onValueChange={function (value) {
                      // console.log("current value: ", value);
                      document.getElementsByClassName(
                        "css-1e195do e1atnqi30"
                      )[0].innerHTML = value[0];
                      document.getElementsByClassName(
                        "css-hl1uwk e1atnqi30"
                      )[0].innerHTML = value[1];
                      // set the state
                      // use the value with other js code
                    }}
                    stepValue={1}
                    showHistogram={true}
                    showFilter={true}
                    filterLabel="Published"
                    interval={2}
                    react={{
                      and: [
                        "search",
                        "fieldsOfStudy",
                        "journals",
                        "authors",
                        "result",
                        "institution",
                      ],
                    }}
                    // URLParams={true}
                    loader="Loading Trend Analysis ..."
                  />
                </Card>

                <Card>
                  <SingleList
                    componentId="fieldsOfStudy"
                    dataField="fieldsOfStudy.keyword"
                    title="Field of Study"
                    size={100}
                    sortBy="count"
                    // defaultValue="London"
                    selectAllLabel="All Fields"
                    showRadio={true}
                    showCount={true}
                    showSearch={true}
                    placeholder="Select Field of Study"
                    react={{
                      // and: ['CategoryFilter', 'SearchFilter'],
                      // and: ["result", "publication-year", "journals", "search"]
                      // and: ["search", "publication-year", "journals", "authors", "result", "institution"]
                      //TODO: Decide whether it should react or show all fields all times
                      and: [
                        "search",
                        "publication-year",
                        "fieldsOfStudy",
                        "journals",
                        "authors",
                        "result",
                        "institution",
                      ],
                    }}
                    showFilter={true}
                    filterLabel="Field"
                    URLParams={false}
                    loader="Loading Fields ..."
                    style={{
                      marginBottom: 5,
                    }}
                  />
                </Card>

                <Card>
                  <MultiList
                    loader={
                      <Skeleton
                        active
                        title={false}
                        paragraph={{ rows: 1, width: "100%" }}
                      />
                    }
                    componentId="journals"
                    dataField="journalName.keyword"
                    size={100}
                    style={{
                      marginBottom: 5,
                    }}
                    title="Journals"
                    react={{
                      // and: ["search"]
                      // and: ["result", "publication-year", "authors", "search"]
                      and: [
                        "search",
                        "publication-year",
                        "fieldsOfStudy",
                        "journals",
                        "authors",
                        "result",
                        "institution",
                      ],
                    }}
                    showFilter={true}
                    filterLabel="Journals"
                    loader="Loading Journals..."
                  />
                </Card>
                <Card>
                  <MultiList
                    loader={
                      <Skeleton
                        active
                        title={false}
                        paragraph={{ rows: 1, width: "100%" }}
                      />
                    }
                    componentId="authors"
                    dataField="authors.name.keyword"
                    /*customQuery={
                                            function (value, props) {
                                                return {
                                                    query: {
                                                        match: {
                                                            "title": "Nilesh Dubey"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        defaultQuery={
                                            function (value, props) {
                                                return {
                                                    timeout: '1s',
                                                    query: {
                                                        match: {
                                                            "title": "A Comparative Study of Unsupervised Machine Learning"
                                                        }
                                                    }
                                                }
                                            }
                                        }*/
                    // size={"999"}
                    // sortBy ="asc"
                    // showLoadMore ="true"
                    style={{
                      marginBottom: 5,
                    }}
                    title="Authors"
                    react={{
                      // and: ["search"]
                      // and: ["result", "publication-year", "journals", "search"]
                      and: [
                        "search",
                        "publication-year",
                        "fieldsOfStudy",
                        "journals",
                        "authors",
                        "result",
                        "institution",
                      ],
                    }}
                    showFilter={true}
                    filterLabel="Authors"
                    loader="Loading Authors..."
                  />
                </Card>

                <Card>
                  <MultiList
                    loader={
                      <Skeleton
                        active
                        title={false}
                        paragraph={{ rows: 1, width: "100%" }}
                      />
                    }
                    componentId="institution"
                    dataField="authors.author_institution.keyword"
                    style={{
                      marginBottom: 5,
                    }}
                    title="Institutions"
                    react={{
                      and: [
                        "search",
                        "publication-year",
                        "fieldsOfStudy",
                        "journals",
                        "authors",
                        "result",
                        "institution",
                      ],
                    }}
                    showFilter={true}
                    filterLabel="Institution"
                    loader="Loading Institutions..."
                  />
                </Card>
              </div>
              <div className="search-result-results">
                <SelectedFilters />

                {/* <Row>
                                     TODO: Add support for showing related topic (entities) only if any exists also add border to boxes for good UI look
                                    <TagCloud
                                        componentId="relatedTopics"
                                        dataField="relatedTopics.keyword"
                                        // dataField="paperAbstract"
                                        title="Related topics"
                                        size={10}
                                        showCount={true}
                                        multiSelect={true}
                                        // defaultValue={['Auckland', 'Atlanta']}
                                        queryFormat="or"
                                        react={{
                                            // and: ["result", "publication-year", "journals", "search"]
                                            and: ["search", "publication-year", "fieldsOfStudy", "journals", "authors", "result", "institution"]

                                        }}
                                        showFilter={true}
                                        filterLabel="Related Topics"
                                        URLParams={false}
                                        loader="Looking for Related topics ..."
                                        className="related-topics-tag-cloud"
                                    />
                                </Row>*/}

                <div id="result">
                  <ReactiveList
                    /*renderResultStats={
                                            function (stats) {
                                                return (
                                                    <span className="search-result-stats">
                                                        About {stats.numberOfResults} results ({stats.time/100} seconds)
                                                    {/!*Showing {stats.displayedResults} of total {stats.numberOfResults} in {stats.time} ms*!/}
                                                    </span>
                                                )
                                            }
                                        }*/
                    innerClass={{
                      resultStats: "search-result-stats",
                    }}
                    sortOptions={[
                      {
                        label: "Best Match",
                        dataField: "_score",
                        sortBy: "desc",
                      },
                      {
                        label: "Citations",
                        dataField: "citationCount",
                        sortBy: "desc",
                      },

                      {
                        label: "Year Descending ",
                        dataField: "year",
                        sortBy: "desc",
                      },
                      {
                        label: "Year Ascending ",
                        dataField: "year",
                        sortBy: "asc",
                      },
                    ]}
                    loader={
                      <Skeleton
                        active
                        title={false}
                        paragraph={{ rows: 3, width: "100%" }}
                      />
                    }
                    componentId="result"
                    dataField="citationCount"
                    pagination={true}
                    size={10}
                    react={{
                      // and: ["publication-year", "authors", "journals", "search"]
                      and: [
                        "search",
                        "publication-year",
                        "fieldsOfStudy",
                        "journals",
                        "authors",
                        "relatedTopics",
                        "institution",
                      ],
                    }}
                    // renderItem={renderItem}
                    render={({ data }) => (
                      <ReactiveList.ResultListWrapper>
                        {data.map((item) => (
                          <div
                            className="search-result-outer-div"
                            key={item.id}
                          >
                            <ResultList key={item._id}>
                              {console.log(item)}
                              <div className="search-result">
                                <div className="search-result-title">
                                  <a href={"/paper-details/" + item._id}>
                                    {item.title}
                                  </a>
                                </div>
                                <div>
                                  {item.authors.map((author, index) => (
                                    <span
                                      className="search-result-author"
                                      key={index}
                                    >
                                      {author.name + ""}
                                    </span>
                                  ))}
                                  {" . "}
                                  <span className="search-result-date">
                                    {item.year}
                                  </span>
                                  <div className="search-result-journal-name">
                                    {item.journalName}
                                  </div>
                                </div>
                                <div className="search-result-abstract">
                                  <span>
                                    {item.paperAbstract.slice(0, 300)}
                                  </span>

                                  <span
                                    id={item._id + "text"}
                                    className="details-text-hidden"
                                  >
                                    {item.paperAbstract.slice(300, -1)}
                                  </span>
                                  <span
                                    id={item._id + "less-button"}
                                    className="display-none"
                                    onClick={() => {
                                      // console.log("F")
                                      this.handleHideText(item._id);
                                    }}
                                  >
                                    {" "}
                                    ...
                                    <span className="details-abstract-more">
                                      (less)
                                    </span>
                                  </span>

                                  {item.paperAbstract.length > 300 ? (
                                    <span
                                      id={item._id + "more-button"}
                                      onClick={() => {
                                        // console.log("F")
                                        this.handleShowText(item._id);
                                      }}
                                    >
                                      {" "}
                                      ...
                                      <span className="details-abstract-more">
                                        (more)
                                      </span>
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                  {/* {item.paperAbstract.slice !=
                              item.paperAbstract.slice(0, 400)
                                ? "..."
                                : ""} */}
                                </div>
                                <span className="search-result-citation">
                                  <Icon
                                    type="bar-chart"
                                    style={{ marginRight: "5px" }}
                                  />

                                  <span className="search-result-citation-count">
                                    {item.citationCount}
                                  </span>

                                  {/* <span>{item.vote_count}</span> */}
                                </span>

                                {item.pdfUrls &&
                                (item.pdfUrls.length > 0 ||
                                  item.s2PdfUrl.length != 0) ? (
                                  <React.Fragment>
                                    <span className="search-result-pdf-link">
                                      <a
                                        href={
                                          item.pdfUrls.length > 0
                                            ? item.pdfUrls[0]
                                            : item.s2PdfUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Icon type="file-pdf" />

                                        <span className="search-result-pdf-link-text">
                                          View PDF
                                        </span>
                                      </a>
                                    </span>
                                  </React.Fragment>
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            </ResultList>
                          </div>
                        ))}
                      </ReactiveList.ResultListWrapper>
                    )}
                    // size={10}
                    style={{
                      marginTop: 20,
                    }}
                  />
                </div>
              </div>
            </Row>
          </ReactiveBase>
        </div>

        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(SearchResult);
