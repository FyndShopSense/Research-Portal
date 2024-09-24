import React, {Component} from "react";
import "./PaperExist.css";

import {Descriptions, Badge, Button, Divider} from "antd";

export class PaperExist extends Component {
    render() {
        return (
            <div className="paper-exist-outer-div">
                <h3><b>Is This Your Paper?</b></h3>
                <Divider/>

                <Descriptions bordered>
                    <Descriptions.Item label="Title " span={3}>
                        {this.props.data.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Doi" span={3}>

                        {this.props.data.doi ?
                            <a href={!this.props.data.doiUrl ? "#" : this.props.data.doiUrl}
                               target="black">{!this.props.data.doi ? "--" : this.props.data.doi}</a> : "-----"
                        }

                    </Descriptions.Item>
                    <Descriptions.Item label="Year Published" span={3}>
                        {this.props.data.year}
                    </Descriptions.Item>
                    <Descriptions.Item label="Citations" span={3}>
                        {this.props.data.citationCount}
                    </Descriptions.Item>
                    <Descriptions.Item label="Authors" span={3}>
                        {this.props.data.authors &&
                        this.props.data.authors.map(name => name.name + ", ")}
                    </Descriptions.Item>
                    {this.props.data.journalName && (
                        <Descriptions.Item label="Journal Name" span={3}>
                            {this.props.data.journalName}
                        </Descriptions.Item>
                    )}
                    {this.props.data.fieldsOfStudy && (
                        <Descriptions.Item label="Fields of Study" span={3}>
                            {this.props.data.fieldsOfStudy &&
                            this.props.data.fieldsOfStudy.map(field => field + ", ")}
                        </Descriptions.Item>
                    )}
                    {this.props.data.pdfUrls &&
                    (this.props.data.pdfUrls.length > 0 ||
                        this.props.data.s2PdfUrl.length !== 0) ? (
                        <Descriptions.Item label="PDF" span={3}>
                            <a
                                target="black"
                                href={
                                    this.props.data.pdfUrls.length > 0
                                        ? this.props.data.pdfUrls[0]
                                        : this.props.data.s2PdfUrl
                                }
                            >
                                View Pdf
                            </a>
                        </Descriptions.Item>
                    ) : (
                        <React.Fragment/>
                    )}
                </Descriptions>
                <div className="paper-exist-button">
                    <Button
                        className="paper-exist-button-no"
                        onClick={this.props.paperExistNo}
                    >
                        No
                    </Button>
                    <Button
                        className="paper-exist-button-yes"
                        type="primary"
                        onClick={this.props.paperExistYes}
                    >
                        Yes
                    </Button>
                </div>
            </div>
        );
    }
}

export default PaperExist;
