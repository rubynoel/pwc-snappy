import React, { Component } from "react";
import SearchBar from "./SearchBar";
import SearchResultsPanel from "./SearchResultsPanel";
import { Container, Row, Col } from "react-bootstrap";
import "../css/search.css";

class SearchPanel extends Component {
  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <SearchBar />
          </Col>
        </Row>
        <Row>
          <Col xs lg="12">
            <SearchResultsPanel />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SearchPanel;
