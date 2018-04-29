import { withAuth } from "@okta/okta-react";
import React, { Component } from "react";
import { Header, Message } from "semantic-ui-react";
import { List, ListItem } from "material-ui/List";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import config from "./.config";

export default withAuth(
  class Elections extends Component {
    constructor(props) {
      super(props);
      this.state = { elections: null, failed: null };
    }

    componentDidMount() {
      this.getElections();
    }

    async getElections() {
      if (!this.state.elections) {
        try {
          const accessToken = await this.props.auth.getAccessToken();
          /* global fetch */
          const response = await fetch(config.resourceServer.electionsUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (response.status !== 200) {
            this.setState({ failed: true });
            return;
          }

          let index = 0;
          const data = await response.json();
          console.log(data, "data");
          const elections = data.map(election => {
            const date = new Date(election.end_date);
            const day = date.toLocaleDateString();
            const time = date.toLocaleTimeString();
            index += 1;
            return {
              date: `${day} ${time}`,
              description: election.description,
              title: election.title,
              id: election.id,
              key: `election-${index}`
            };
          });
          console.log("elections", elections);
          this.setState({ elections, failed: false });
        } catch (err) {
          this.setState({ failed: true });
          /* eslint-disable no-console */
          console.error(err);
        }
      }
    }

    render() {
      const possibleErrors = ["First Error", "Second Error"];
      return (
        <div>
          <Header as="h1">Upcoming Elections</Header>
          {this.state.failed === true && (
            <Message
              error
              header="Failed to fetch elections.  Please verify the following:"
              list={possibleErrors}
            />
          )}
          {this.state.failed === null && <p>Fetching Elections..</p>}
          {this.state.elections && (
            <div>
              <MuiThemeProvider>
                <List>
                  {this.state.elections.map(election => (
                    <ListItem
                      primaryText={election.title}
                      secondaryText={election.description}
                      href="google.com"
                    />
                  ))}
                </List>
              </MuiThemeProvider>
            </div>
          )}
        </div>
      );
    }
  }
);
