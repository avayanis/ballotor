import { withAuth } from "@okta/okta-react";
import React, { Component } from "react";
import { Header, Message, Image } from "semantic-ui-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Parser as HtmlToReactParser } from "html-to-react";
import CircularProgress from "material-ui/CircularProgress";
// import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";
import RaisedButton from "material-ui/RaisedButton";

import { checkAuthentication } from "./helpers";
import config from "./.config";

export default withAuth(
  class ViewCandidate extends Component {
    constructor(props) {
      super(props);
      this.state = {
        candidateId: this.props.match.params.candidateId,
        candidateInfo: null,
        failed: null,
        authenticated: null
      };
      this.checkAuthentication = checkAuthentication.bind(this);
      this.submitVote = this.submitVote.bind(this);
    }

    componentDidMount() {
      this.checkAuthentication();
      this.getCandidateInfo();
    }

    componentDidUpdate() {
      this.checkAuthentication();
      this.getCandidateInfo();
    }

    async getCandidateInfo() {
      if (!this.state.candidateInfo) {
        try {
          const accessToken = await this.props.auth.getAccessToken();
          /* global fetch */
          const response = await fetch(
            config.resourceServer.specificCandidateUrl.replace(
              ":candidateId",
              this.state.candidateId
            ),
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );

          if (response.status !== 200) {
            this.setState({ failed: true });
            return;
          }

          const json = await response.json();
          console.log("candidateJson", json);
          const candidateInfo = {
            name: `${json.first} ${json.last}`,
            id: json.id,
            mainImage: json.portrait,
            rotatingImages: json.images,
            description: json.description,
            title: json.title
          };
          console.log("candidateInfo", candidateInfo);
          this.setState({ candidateInfo, failed: false });
        } catch (err) {
          this.setState({ failed: true });
          /* eslint-disable no-console */
          console.error(err);
        }
      }
    }

    async submitVote(candidateId) {
      console.log("submit the vote for", candidateId);
    }

    render() {
      const htmlToReactParser = new HtmlToReactParser();
      return (
        <MuiThemeProvider>
          <div style={styles.root}>
            {this.state.failed === true && (
              <div>
                <Header as="h1">Could not find candidate information</Header>
                <Message error header="Failed to fetch candidate info." />
              </div>
            )}
            {this.state.failed === null && (
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
                <p>Loading information about candidate...</p>
              </div>
            )}
            {!this.state.candidateInfo && (
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
                <p>Loading information about candidate...</p>
              </div>
            )}
            {this.state.candidateInfo && (
              <div>
                <div style={{ marginBottom: "30px" }}>
                  <Header style={{ textAlign: "center" }} as="h1">
                    {this.state.candidateInfo.name}
                  </Header>
                  <Header
                    style={{ marginTop: "0", textAlign: "center" }}
                    as="h3"
                  >
                    {this.state.candidateInfo.title}
                  </Header>
                  {this.state.authenticated && (
                    <RaisedButton
                      label="Vote"
                      secondary={true}
                      fullWidth={true}
                      onClick={() =>
                        this.submitVote(this.state.candidateInfo.id)
                      }
                    />
                  )}
                </div>
                <Image
                  style={{
                    float: "left",
                    width: "320px",
                    margin: "0 10px 10px 0"
                  }}
                  src={this.state.candidateInfo.mainImage}
                />
                <div
                  style={{
                    textAlign: "justify",
                    marginTop: "0"
                  }}
                >
                  {htmlToReactParser.parse(
                    this.state.candidateInfo.description
                  )}
                </div>
                {/* <AutoRotatingCarousel open>
                  {this.state.candidateInfo.rotatingImages.map(
                    (image, index) => {
                      <Slide
                        media={<Image src={image} />}
                        title=""
                        subtitle=""
                      />;
                    }
                  )}
                </AutoRotatingCarousel> */}
              </div>
            )}
          </div>
        </MuiThemeProvider>
      );
    }
  }
);

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: "auto"
  }
};
