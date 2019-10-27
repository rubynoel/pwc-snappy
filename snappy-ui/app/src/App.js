import React, { Component, Fragment } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchPanel from "./components/SearchPanel";

class App extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    if (this.props.authState == "signedIn") {
      return <SearchPanel />;
    } else {
      return null;
    }
  }
}

export default App;
