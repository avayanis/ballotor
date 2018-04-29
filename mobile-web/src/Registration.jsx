import React, { Component } from "react";
import { Container, Icon, Image, Menu } from "semantic-ui-react";
import { Card, CardTitle, TextField, RaisedButton } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import $ from "jquery";
import config from "./.config";
import "./Registration.css";

export default class Registration extends Component {
  constructor(props) {
    super(props);
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
        password: $("#password").val()
      },
      function() {
        console.log("successful login!");
      },
      "json"
    ).fail(function() {
      console.log("failed login!");
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
