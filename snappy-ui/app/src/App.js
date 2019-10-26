import React, { Component, Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchPanel from './components/SearchPanel';

class App extends Component {
  state = {  }
  render() {
    return (
     <Fragment><SearchPanel/></Fragment>
    );
  }
}
 
export default App;