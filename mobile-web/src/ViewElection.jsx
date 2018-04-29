import { withAuth } from "@okta/okta-react";
import React, { Component } from "react";
import { Header, Message } from "semantic-ui-react";
import { GridList, GridTile } from "material-ui/GridList";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { Parser as HtmlToReactParser } from "html-to-react";
import CircularProgress from "material-ui/CircularProgress";
import { NavLink } from "react-router-dom";

import config from "./.config";

export default withAuth(
  class ViewElection extends Component {
    constructor(props) {
      super(props);
      this.state = {
        electionId: this.props.match.params.electionId,
        electionInfo: null,
        candidates: null,
        failed: null
      };
    }

    componentDidMount() {
      this.getElectionInfo();
      this.getCandidateInfo();
    }

    componentDidUpdate() {
      this.getElectionInfo();
      this.getCandidateInfo();
    }

    async getElectionInfo() {
      if (!this.state.electionInfo) {
        try {
          const accessToken = await this.props.auth.getAccessToken();
          /* global fetch */
          const response = await fetch(
            config.resourceServer.specificElectionUrl.replace(
              ":electionId",
              this.state.electionId
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

          const electionJson = await response.json();
          console.log("electionJson", electionJson);
          const date = new Date(electionJson.end_date);
          const day = date.toLocaleDateString();
          const time = date.toLocaleTimeString();
          const electionInfo = {
            date: `${day} ${time}`,
            description: electionJson.description,
            title: electionJson.title,
            id: electionJson.id
          };
          console.log("electionInfo", electionInfo);
          this.setState({ electionInfo, failed: false });
        } catch (err) {
          this.setState({ failed: true });
          /* eslint-disable no-console */
          console.error(err);
        }
      }
    }

    async getCandidateInfo() {
      if (!this.state.candidatesInfo) {
        try {
          const accessToken = await this.props.auth.getAccessToken();
          /* global fetch */
          const response = await fetch(
            config.resourceServer.electionCandidatesUrl.replace(
              ":electionId",
              this.state.electionId
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

          const candidatesJson = await response.json();
          console.log("candidatesJson", candidatesJson);
          const candidates = candidatesJson.map(candidate => {
            return {
              name: `${candidate.first} ${candidate.last}`,
              id: candidate.id,
              image: candidate.portrait,
              description: candidate.description
            };
          });
          this.setState({ candidatesInfo: candidates, failed: false });
        } catch (err) {
          this.setState({ failed: true });
          /* eslint-disable no-console */
          console.error(err);
        }
      }
    }

    render() {
      // const htmlToReactParser = new HtmlToReactParser();
      return (
        <div style={styles.root}>
          {this.state.failed === true && (
            <div>
              <Header as="h1">Could not find Election</Header>
              <Message error header="Failed to fetch election info." />
            </div>
          )}
          {(this.state.failed === null || true) && (
            <p style={{ width: "100%", textAlign: "center" }}>
              Fetching info for Election...
            </p>
          )}
          {this.state.electionInfo && (
            <MuiThemeProvider>
              <div>
                <Header style={{ textAlign: "center" }} as="h1">
                  {this.state.electionInfo.title}
                </Header>
                <div style={{ textAlign: "center", marginTop: "0" }}>
                  {this.state.electionInfo.description}
                </div>

                <div style={{ display: "inline-block", margin: "10px auto" }}>
                  {!this.state.candidatesInfo && (
                    <div style={{ textAlign: "center" }}>
                      <CircularProgress />
                      <p>Loading Candidates</p>
                    </div>
                  )}
                  {this.state.candidatesInfo && (
                    <GridList cellHeight={320} style={styles.gridList}>
                      {this.state.candidatesInfo.map((candidate, index) => (
                        <NavLink key={index} to={`/candidates/${candidate.id}`}>
                          <GridTile title={candidate.name}>
                            <img src={candidate.image} alt={candidate.name} />
                          </GridTile>
                        </NavLink>
                      ))}
                    </GridList>
                  )}
                </div>
              </div>
            </MuiThemeProvider>
          )}
        </div>
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
