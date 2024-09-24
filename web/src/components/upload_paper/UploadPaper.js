import React, { Component } from "react";
import { Steps, Button, Form, message, Divider } from "antd";
import ReactDOM from "react-dom";
// import '/Users/meghasankhlecha/Desktop/Megha/SIH/Test/my-app/src/App.css';
import First from "./FormStepOne";
import Second from "./FormStepTwo";
import Third from "./FormStepFinal";

import NavBar from "../navbar/NavBar.jsx";
import Footer from "../footer/Footer";
import PaperExist from "./PaperExist";

import "./UploadPaper.css";
import constants from "../../constants";

import axios from "axios";

const { Step } = Steps;

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

class UploadPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      paperExistComponent: false,
      firstStepButtonLoading: false,
      paperExistDetails: {},
      formData: {},
    };
  }

  paperExistNo = () => {
    console.log("paperExistNo");
    this.setState({ paperExistComponent: false });
    const current = this.state.current + 1;
    this.setState({ current });
  };
  paperExistYes = () => {
    // TODO: Somehow get the values of all authors which showed up in the paper result in previous step
    // var author_names = ["Amit Ganatra", "Parth Shah", "Kushan Mehta"];
    var author_names = this.state.paperExistDetails.authors.map(
      (author) => author.name
    );
    console.log(author_names);
    console.log(
      this.state.paperExistDetails.authors.map((author) => author.name)
    );

    var paper_authentic = false;

    for (var a_name of author_names) {
      var similarity_score = similarity(
        localStorage.getItem("user_name"),
        a_name
      );
      console.log(
        "Similarity: " +
          localStorage.getItem("user_name") +
          ", " +
          a_name +
          " = " +
          similarity_score
      );
      if (similarity_score >= 0.65) {
        paper_authentic = true;
        break;
      }
    }

    console.log("paperExistYes");

    if (paper_authentic) {
      message.success(
        "Success! Research Paper has been linked with your profile"
      );
    } else {
      message.error(
        "Error: We couldn't verify that you are one of the author of this paper."
      );
    }
  };
  // handleSubmit = e => {
  //   this.next();
  //   if(this.state.current==0){
  //     // this.handleFirstFormSubmit(e);
  //   }
  //   // alert("parent")

  // };
  handleFirstFormSubmit = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form parent:", values);
        if (values.title) {
          this.setState({ firstStepButtonLoading: true });
          this.setState({ formData: values });
          // fetch(constants.elasticSearchUrl + constants.elasticSearchAppName +"/_search", {
          //   method: "POST",
          //   body: JSON.stringify({
          //     title:values.title,
          //     doi:values.doi || ""
          //   })
          // })
          // fetch(constants.elasticSearchUrl + constants.elasticSearchAppName + "/_search?q=title:" + values.title)
          //   .then(response => {
          //     // console.log(response)
          //     if (response.status == 200) {
          //       return response.json();
          //     } else {
          //       message.error("Error!");
          //       this.setState({ firstStepButtonLoading: false });
          //     }
          //   })
          //   .then(myJson => {
          //     let responseDetails=myJson.hits.hits[0]._source

          //     // console.log(myJson.hits.hits.length);
          //     if (true) {
          //       this.setState({
          //         paperExistDetails: responseDetails
          //       });
          //       this.setState({
          //         firstStepButtonLoading: false,
          //         paperExistComponent: true
          //       });
          //     } else {
          //       this.next();
          //     }
          //   })
          //   .catch(err => {
          //     console.log("Fetch Error :-S", err);
          //     message.error("Error!");
          //     this.setState({ firstStepButtonLoading: false });
          //   });

          axios
            .get(
              constants.elasticSearchUrl +
                constants.elasticSearchAppName +
                "/_search?q=title:" +
                values.title
            )
            .then((res) => {
              console.log(res);
              let responseDetails = res.data.hits.hits[0]._source;

              // console.log(myJson.hits.hits.length);
              if (true) {
                this.setState({
                  paperExistDetails: responseDetails,
                });
                this.setState({
                  firstStepButtonLoading: false,
                  paperExistComponent: true,
                });
              } else {
                this.next();
              }
            })
            .catch((err) => {
              console.error(err);
              message.error("Error!");
              this.setState({ firstStepButtonLoading: false });
            });

          // this.next();
        }
      }
    });
  };
  handleSecondFormSubmit = (e) => {
    this.next();
    console.log("second for parent value", e);
    this.setState({ formData: { ...this.state.formData, ...e } });
  };
  // handleSubmit = e => {
  //       alert("1");

  //   // console.log("handleSubmit")
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // };

  // validateInput = () => {
  //   alert("2");

  //   // document.getElementById("lookup-paper-button").click();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log("Received values of form:", values);
  //       if (values.title) {
  //         this.next();
  //       }
  //     }
  //   });
  //   // alert("sadjhdasjh");
  //   // this.next();
  // };

  next = () => {
    // console.log(this.state.current)
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     console.log("Received values of form:", values);
    //     if (values.title) {
    //       // this.next();
    //     }
    //   }
    // });
    const current = this.state.current + 1;
    this.setState({ current });
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  render() {
    const { current } = this.state;
    let steps = [
      {
        title: "Paper Lookup",
        content: (
          <First
            form={this.props.form}
            buttonLoading={this.state.firstStepButtonLoading}
            handleFirstFormSubmit={this.handleFirstFormSubmit}
          />
        ),
      },
      {
        title: "Paper Details",
        content: (
          <Second
            form={this.props.form}
            prev={this.prev}
            handleSecondFormSubmit={this.handleSecondFormSubmit}
          />
        ),
      },
      {
        title: "Author Details",
        content: (
          <Third
            form={this.props.form}
            prev={this.prev}
            formData={this.state.formData}
          />
        ),
      },
    ];
    return (
      <React.Fragment>
        <div className="navbar-outer-div">
          <NavBar />
        </div>
        <div style={{ paddingTop: "90px" }}></div>
        <div className="login-form step-outer-container">
          {!this.state.paperExistComponent ? (
            <Form
            // onSubmit={this.handleSubmit}

            // style={{ width: "70%", margin: "auto", paddingTop: "3%" ,paddingBottom:"30px"}}
            >
              <div>
                <Steps current={current}>
                  {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                  ))}
                </Steps>
                <Divider />
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action steps-action-button-button">
                  {/* {current > 0 && (
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => this.prev()}
                    >
                      Previous
                    </Button>
                  )} */}
                  {/* {current < steps.length - 1 && (
                  <Button
                    style={{ marginLeft: "10px" }}
                    type="primary"
                    onClick={() => this.next()}
                    // style={{width:'10%', marginLeft: '42%'}}
                  >
                    Next
                  </Button>
                )} */}
                  {/* {current === steps.length - 1 && (
                    <Button
                      style={{ marginLeft: "10px" }}
                      type="primary"
                      onClick={() => message.success("Processing complete!")}
                      // style={{width:'10%', marginLeft: '45%'}}
                    >
                      Done
                    </Button>
                  )} */}
                </div>
              </div>
            </Form>
          ) : (
            <PaperExist
              data={this.state.paperExistDetails}
              paperExistNo={this.paperExistNo}
              paperExistYes={this.paperExistYes}
            />
          )}
        </div>
        {/* <div className="home-footer"> */}
        <br />
        <br />
        <br />
        <br />

        <Footer />
        {/* </div> */}
      </React.Fragment>
    );
  }
}

const Final = Form.create()(UploadPaper);
// ReactDOM.render(<Final />, document.getElementById("root"));
export default Final;

// import React, { Component } from "react";
// import { Steps, Button, Form, message } from "antd";
// import ReactDOM from "react-dom";
// // import '/Users/meghasankhlecha/Desktop/Megha/SIH/Test/my-app/src/App.css';
// import First from "./steps/FormStepOne";
// import Second from "./steps/FormStepTwo";
// import Third from "./steps/FormStepFinal";

// import NavBar from "./NavBar.jsx";
// import Footer from "./Footer";

// const { Step } = Steps;

// class StepForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       current: 0,
//     };
//   }

//   next() {
//     const current = this.state.current + 1;
//     this.setState({ current });
//   }

//   prev() {
//     const current = this.state.current - 1;
//     this.setState({ current });
//   }

//   render() {
//     const { current } = this.state;
//      let steps = [
//       {
//         title: "Paper Lookup",
//         content: <First form={this.props.form} />
//       },
//       {
//         title: "Paper Details",
//         content: <Second form={this.props.form} />
//       },
//       {
//         title: "Author Details",
//         content: <Third form={this.props.form} />
//       }
//     ];
//     return (
//      <Form onSubmit={this.handleSubmit} className="login-form" style={{ width : '70%' , margin : 'auto', paddingTop: '3%'}}>
//       <div>
//         <Steps current={current}>
//           {steps.map(item => (
//             <Step key={item.title} title={item.title} />
//           ))}
//         </Steps>
//         <div className="steps-content">{steps[current].content}</div>
// <div className="steps-action">
//   {current < steps.length - 1 && (
//     <Button type="primary" onClick={() => this.next()} style={{width:'10%', marginLeft: '45%'}}>
//       Next
//     </Button>
//   )}
//   {current === steps.length - 1 && (
//     <Button type="primary" onClick={() => message.success('Processing complete!')} style={{width:'10%', marginLeft: '45%'}}>
//       Done
//     </Button>
//   )}
//   {current > 0 && (
//     <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
//       Previous
//     </Button>
//   )}
// </div>
//       </div>
//       </Form>
//     );
//   }
// }
// const Final = Form.create()(StepForm);
// // ReactDOM.render(<Final/>, document.getElementById('root'));
// export default Final;
