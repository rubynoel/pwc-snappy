import React, { Component, Fragment } from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import { paginateItems } from "../actions/SearchActions";

class SearchResultsPanel extends Component {
  state = {};

  handlePageClick = (pageNumber, prev, next) => {
    console.log("hello ", pageNumber, prev, next);
    this.props.dispatch(paginateItems({ pageNumber, prev, next }));
  };

  render = () => {
    const data = [{ name: "test" }, { name: "testdsadsa" }];
    return (
      <Fragment>
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
        {this.getPaginationBar()}
      </Fragment>
    );
  };

  getPaginationBar = () => {
    let items = [];
    if (this.props.pageTotal === 0) {
      return <p>{this.props.pageTotal} Results</p>;
    }

    if (this.props.pageTotal >= 10) {
      for (
        let number = this.props.pageTotal / 2 - 2;
        number <= this.props.pageTotal / 4;
        number++
      ) {
        items.push(<span onClick={() => this.handlePageClick(number)}>1</span>);
      }
    } else {
      for (let number = 1; number <= this.props.pageTotal; number++) {
        items.push(
          <span onClick={() => this.handlePageClick(number)}>{number}</span>
        );
      }
    }
    return (
      <div className="pagination">
        <span onClick={() => this.handlePageClick(undefined, true)}>Prev</span>
        {items.map(pageItem => pageItem)}
        <span onClick={() => this.handlePageClick(undefined, undefined, true)}>
          Next
        </span>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    items: state.search.rows,
    pageTotal: Math.ceil(state.search.total / state.search.limit)
  };
};

export default connect(mapStateToProps)(SearchResultsPanel);
