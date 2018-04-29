import React, { Component } from "react";
import { Card, CardTitle, TextField, RaisedButton } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import $ from "jquery";
import "./Registration.css";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = { failureReason: null };
    this.createAccount = this.createAccount.bind(this);
  }
  componentDidMount() {}
  createAccount(e) {
    e.preventDefault();

    $.post(
      "http://localhost:3000/api/v1/user",
      {
        firstName: $("#first-name").val(),
        lastName: $("#last-name").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        ssn: $("#ssn").val()
      },
      () => {
        window.location.href = "/login";
      },
      "json"
    ).fail(err => {
      console.log("failed login!", err);
      this.setState({ failureReason: err.responseJSON.reason });
    });
  }
  render() {
    return (
      <div className="registration">
        <MuiThemeProvider>
          <Card>
            <CardTitle title="Sign up for Ballator" />

            <form>
              <TextField id="first-name" floatingLabelText="First Name" />
              <br />
              <TextField id="last-name" floatingLabelText="Last Name" />
              <br />
              <TextField id="email" type="email" floatingLabelText="Email" />
              <br />
              <TextField
                id="password"
                type="password"
                floatingLabelText="Password"
              />
              <br />
              <TextField
                id="ssn"
                type="password"
                floatingLabelText="Social Security Number"
              />
              <br />
              {this.state.failureReason && (
                <p className="form-error-reason">{this.state.failureReason}</p>
              )}
              <RaisedButton
                label="Create Account"
                primary={true}
                type="submit"
                onClick={this.createAccount}
              />
            </form>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }
}
