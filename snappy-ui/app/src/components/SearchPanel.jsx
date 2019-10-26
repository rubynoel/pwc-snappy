import React, { Component } from 'react';
import SearchBar from './SearchBar';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/search.css';

class SearchPanel extends Component {
    state = {  }
    render() { 
        return (  <Container>
            <Row className="justify-content-md-center">
            
       <Col xs lg="8">
       <SearchBar />
       </Col>
          
           </Row>
         </Container> );
    }
}
 
export default SearchPanel;