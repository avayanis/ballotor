import { withAuth } from "@okta/okta-react";
import React, { Component } from "react";
import { Container, Menu } from "semantic-ui-react";
import { checkAuthentication } from "./helpers";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default withAuth(
  class Navbar extends Component {
    constructor(props) {
      super(props);
      this.state = { authenticated: null };
      this.checkAuthentication = checkAuthentication.bind(this);
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
      this.checkAuthentication();
    }

    async componentDidUpdate() {
      this.checkAuthentication();
    }

    async login() {
      this.props.auth.login("/");
    }

    async logout() {
      this.props.auth.logout("/");
    }

    render() {
      return (
        <div>
          <Menu id="nav-bar" fixed="top" inverted>
            <Container>
              <Menu.Item header>
                <NavLink to="/">Ballotor</NavLink>
              </Menu.Item>
              {this.state.authenticated === true && (
                <Menu.Item id="elections-button">
                  <NavLink to="/elections">Elections</NavLink>
                </Menu.Item>
              )}
              {this.state.authenticated === true && (
                <Menu.Item id="profile-button">
                  <NavLink to="/profile">Profile</NavLink>
                </Menu.Item>
              )}
              {this.state.authenticated === true && (
                <Menu.Item id="logout-button" as="a" onClick={this.logout}>
                  Logout
                </Menu.Item>
              )}
              {this.state.authenticated === false && (
                <Menu.Item as="a" onClick={this.login}>
                  Login
                </Menu.Item>
              )}
            </Container>
          </Menu>
        </div>
      );
    }
  }
);
