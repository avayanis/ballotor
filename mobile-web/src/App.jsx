import React, { Component } from "react";
import { Route, HashRouter } from "react-router-dom";
import { Security, ImplicitCallback } from "@okta/okta-react";
import { Container } from "semantic-ui-react";
import config from "./.config";
import Home from "./Home";
import CustomLoginComponent from "./Login";
import Elections from "./Elections";
import Navbar from "./Navbar";
import Profile from "./Profile";
import Registration from "./Registration";
import ViewElection from "./ViewElection";
import ViewCandidate from "./ViewCandidate";

function customAuthHandler({ history }) {
  // Redirect to the /login page that has a CustomLoginComponent
  history.push("/login");
}

class App extends Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Security
            issuer={config.oidc.issuer}
            client_id={config.oidc.clientId}
            redirect_uri={config.oidc.redirectUri}
            onAuthRequired={customAuthHandler}
          >
            <Navbar />
            <Container text style={{ marginTop: "7em" }}>
              <Route path="/" exact component={Home} />
              <Route path="/implicit/callback" component={ImplicitCallback} />
              <Route path="/login" component={CustomLoginComponent} />
              <Route path="/signup" component={Registration} />
              <Route exact path="/elections" component={Elections} />
              <Route path="/elections/:electionId" component={ViewElection} />
              <Route
                path="/election/:electionId/candidates/:candidateId"
                component={ViewCandidate}
              />
              <Route path="/profile" component={Profile} />
            </Container>
          </Security>
        </HashRouter>
      </div>
    );
  }
}

export default App;
