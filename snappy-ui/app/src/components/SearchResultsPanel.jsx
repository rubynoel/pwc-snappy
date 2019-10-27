import React, { Component } from "react";
import { Table } from "react-bootstrap";

class SearchResultsPanel extends Component {
  state = {};
  render() {
    const data = [{ name: "test" }, { name: "testdsadsa" }];
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Business Number</th>
            <th>Company Name</th>
            <th>Service</th>
            <th>Tagline</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => {
            return (
              <tr>
                <td>{row.name}</td>
                <td>{row.name}</td>
                <td>{row.name}</td>
                <td>{row.name}</td>
                <td>{row.name}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export default SearchResultsPanel;
