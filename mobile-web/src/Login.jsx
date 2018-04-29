import React, { Component } from "react";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import "@okta/okta-signin-widget/dist/css/okta-theme.css";
import { getSignIn } from "./helpers";

export default class LoginPage extends Component {
  componentDidMount() {
    getSignIn().renderEl(
      { el: "#sign-in-widget" },
      () => {
        console.log("signIn.renderEl.success");
      },
      err => {
        throw err;
      }
    );
  }

  render() {
    return (
      <div>
        <div id="sign-in-widget" />
      </div>
    );
  }
}
