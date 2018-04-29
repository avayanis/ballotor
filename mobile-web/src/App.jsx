import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Security, SecureRoute, ImplicitCallback } from "@okta/okta-react";
import { Container } from "semantic-ui-react";
import config from "./.config";
import Home from "./Home";
import CustomLoginComponent from "./Login";
import Elections from "./Elections";
import Navbar from "./Navbar";
import Profile from "./Profile";
import Registration from "./Registration";

function customAuthHandler({ history }) {
  // Redirect to the /login page that has a CustomLoginComponent
  history.push("/login");
}

class App extends Component {
  render() {
    return (
      <div>
        <Router>
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
              <SecureRoute path="/elections" component={Elections} />
              <SecureRoute path="/profile" component={Profile} />
            </Container>
          </Security>
        </Router>
      </div>
    );
  }
}

export default App;