/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React, { Component } from "react";
import { Container, Icon, Image, Menu } from "semantic-ui-react";
import { Card, CardTitle, TextField, RaisedButton } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import $ from "jquery";
import config from "./.samples.config";
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
