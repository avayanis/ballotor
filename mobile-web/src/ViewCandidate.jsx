import { withAuth } from "@okta/okta-react";
import React, { Component } from "react";
import { Header, Message } from "semantic-ui-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Parser as HtmlToReactParser } from "html-to-react";
import CircularProgress from "material-ui/CircularProgress";

import config from "./.config";

export default withAuth(
  class ViewCandidate extends Component {
    constructor(props) {
      super(props);
      this.state = {
        candidateId: this.props.match.params.candidateId,
        candidateInfo: null,
        failed: null
      };
    }

    componentDidMount() {
      this.getCandidateInfo();
    }

    componentDidUpdate() {
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

          const candidateJson = await response.json();
          console.log("candidateJson", candidateJson);
          const candidateInfo = {
            name: `${candidateJson.first} ${candidateJson.last}`,
            id: candidateJson.id,
            image: candidateJson.portrait,
            description: candidateJson.description
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
                <Header style={{ textAlign: "center" }} as="h1">
                  {this.state.candidateInfo.name}
                </Header>
                <div style={{ textAlign: "center", marginTop: "0" }}>
                  {htmlToReactParser.parse(
                    this.state.candidateInfo.description
                  )}
                </div>
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
