import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { StyleSheet, Text, View } from "react-native";

class Hub extends Component {
  constructor(props) {
    super(props);
  }

  static mapStateToProps(state) {
    return {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello World from the Hub!</Text>
      </View>
    );
  }
}

Hub.propTypes = {};

export default connect(Hub.mapStateToProps)(Hub);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
