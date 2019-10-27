import React, { Component, Fragment } from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import { paginateItems } from "../actions/SearchActions";
import ReactPaginate from "react-paginate";

class SearchResultsPanel extends Component {
  handlePageClick = selected => {
    this.props.dispatch(paginateItems({ pageNumber: selected }));
  };

  render = () => {
    const { pageTotal, items, itemsTotal } = this.props;
    return (
      <Fragment>
        <p>{itemsTotal > 0 ? itemsTotal : "No"} Results</p>
        {itemsTotal > 5 ? this.getPaginationBar() : null}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Business Number</th>
              <th>Company Name</th>
              <th>Restricted Status</th>
              <th>Service</th>
              <th>Tagline</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {items.map(row => {
              return (
                <tr>
                  <td>{row.businessNumber}</td>
                  <td>{row.name}</td>
                  <td>
                    {row.restrictedFlag === true
                      ? "Restricted"
                      : "Not Restricted"}
                  </td>
                  <td>{row.service}</td>
                  <td>{row.tagline}</td>
                  <td>{row.email}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {this.getPaginationBar()}
      </Fragment>
    );
  };

  /*getPaginationBar = () => {
    const { pageTotal } = this.props;
    if (pageTotal > 0) {
      return (
        <Fragment>
          <ReactPaginate
            previousLabel={"<<"}
            nextLabel={">>"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.props.pageTotal}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={data => this.handlePageClick(data)}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"test"}
          />
        </Fragment>
      );
    } else {
      return null;
    }
  };*/
  getPaginationBar = () => {
    const { offset, limit, pageTotal } = this.props;
    console.log(`offset ${offset} ${limit}`);
    let items = [];
    let active = 1;

    if (pageTotal >= 10) {
      for (let number = pageTotal / 2 - 2; number <= pageTotal / 4; number++) {
        items.push(
          <span onClick={() => this.handlePageClick(number - 1)}>1</span>
        );
      }
    } else {
      for (let number = 1; number <= pageTotal; number++) {
        items.push(
          <span onClick={() => this.handlePageClick(number - 1)}>{number}</span>
        );
      }
    }
    return (
      <div className="pagination">
        <span
          onClick={() =>
            this.handlePageClick(
              (offset >= limit ? offset - limit : 0) / limit
            ) * limit
          }
        >
          Prev
        </span>
        {items.map(pageItem => pageItem)}
        <span
          onClick={() =>
            this.handlePageClick(
              ((offset + limit < pageTotal ? offset + limit : pageTotal - 1) /
                limit) *
                limit
            )
          }
        >
          Next
        </span>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    items: state.search.rows,
    itemsTotal: state.search.total,
    pageTotal: Math.ceil(state.search.total / state.search.searchParams.limit),
    offset: state.search.searchParams.from,
    limit: state.search.searchParams.limit
  };
};

export default connect(mapStateToProps)(SearchResultsPanel);
