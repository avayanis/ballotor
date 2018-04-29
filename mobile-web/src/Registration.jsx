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
import $ from "jquery";
import config from "./.samples.config";

export default class Registration extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  createAccount(e) {
    e.preventDefault();

    $.post(
      "http://localhost:3000/user",
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
      <form>
        <input
          type="text"
          id="first-name"
          name="first-name"
          placeholder="First Name"
        />
        <input
          type="text"
          id="last-name"
          name="last-name"
          placeholder="Last Name"
        />
        <input type="email" id="email" name="email" placeholder="Email" />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
        />

        <button type="submit" onClick={this.createAccount}>
          Create Account
        </button>
      </form>
    );
  }
}
