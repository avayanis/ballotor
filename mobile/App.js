import React, { Component } from "react";
import { Provider } from "react-redux";

import configureStore from "./src/configureStore";
import Hub from "./src/containers/Hub";

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Hub />
      </Provider>
    );
  }
}
