import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CustomSelect from "./CustomSelect";
import { searchItems, paginationDefaults } from "../actions/SearchActions";
import { Formik } from "formik";

class SearchBar extends Component {
  searchTypes = {
    SEARCH_BY_COMPANY_NAME: "companyName",
    SEARCH_BY_BUSINESS_NUMER: "businessNumber",
    SEARCH_BY_RESTRICTED_STATUS_TRUE: "restricted",
    SEARCH_BY_RESTRICTED_STATUS_FALSE: "notRestricted",
    SEARCH_BY_RESTRICTED_STATUS_APIPARAM: "restrictedStatus"
  };

  constructor(props) {
    super(props);
    const { label, value } = this.getDefaultSearchType();
    this.state = {
      searchKeyword: null,
      selectedSearchType: { id: value, name: label },
      validationErrors: {}
    };
  }

  handleSearchClick = () => {
    console.log(`isnab ${!isNaN(this.state.searchKeyword)}`);
    const { searchKeyword, selectedSearchType, validationErrors } = this.state;
    if (
      this.state.selectedSearchType.id ===
        this.searchTypes.SEARCH_BY_BUSINESS_NUMER &&
      isNaN(searchKeyword)
    ) {
      this.setState({
        validationErrors: {
          ...validationErrors,
          ...{ searchKeyword: "Only numbers allowed" }
        }
      });
    } else {
      this.setState({
        validationErrors: {}
      });
      let searchTypeApiParam = selectedSearchType.id;
      let searchKeywordApiParam = searchKeyword;
      if (
        selectedSearchType.id ===
          this.searchTypes.SEARCH_BY_RESTRICTED_STATUS_TRUE ||
        selectedSearchType.id ===
          this.searchTypes.SEARCH_BY_RESTRICTED_STATUS_FALSE
      ) {
        searchTypeApiParam = this.searchTypes
          .SEARCH_BY_RESTRICTED_STATUS_APIPARAM;
        searchKeywordApiParam =
          selectedSearchType.id ===
          this.searchTypes.SEARCH_BY_RESTRICTED_STATUS_TRUE
            ? true
            : false;
      }

      const { from, limit } = paginationDefaults;
      this.props.dispatch(
        searchItems({
          searchKeyword: searchKeywordApiParam,
          searchType: searchTypeApiParam,
          from: from,
          limit: limit
        })
      );
    }
  };

  handleKeywordChange = event => {
    this.setState({ searchKeyword: event.target.value });
  };

  handleSearchTypeChange = event => {
    this.setState({
      selectedSearchType: { id: event.value, name: event.label }
    });
  };

  getSearchTypeLOVs = () => [
    { label: "Company Name", value: this.searchTypes.SEARCH_BY_COMPANY_NAME },
    {
      label: "Business Number",
      value: this.searchTypes.SEARCH_BY_BUSINESS_NUMER
    },
    {
      label: "Restricted Companies",
      value: this.searchTypes.SEARCH_BY_RESTRICTED_STATUS_TRUE
    },
    {
      label: "Not Restricted Companies",
      value: this.searchTypes.SEARCH_BY_RESTRICTED_STATUS_FALSE
    }
  ];

  getDefaultSearchType = () => {
    return this.getSearchTypeLOVs()[0];
  };

  render() {
    const { selectedSearchType } = this.state;
    return (
      <Form className="search-form-area">
        <Form.Row className="justify-content-center form-wrap">
          <Form.Group
            controlId="searchType"
            className="col-md-8 post-form-group"
          >
            <Form.Label>Search By</Form.Label>
            <CustomSelect
              placeholder="Search Type"
              onChange={this.handleSearchTypeChange}
              selectedOption={
                selectedSearchType
                  ? {
                      value: selectedSearchType.id,
                      label: selectedSearchType.name
                    }
                  : this.getDefaultSearchType()
              }
              defaultOptions={this.getSearchTypeLOVs()}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className="justify-content-center form-wrap">
          <Form.Group
            controlId="searchKeyword"
            className="col-md-8 post-form-group"
          >
            <Form.Label>Search Keyword</Form.Label>
            <Form.Control
              as="input"
              placeholder="Enter a keyword to search"
              onChange={this.handleKeywordChange}
              disabled={
                selectedSearchType.id ===
                  this.searchTypes.SEARCH_BY_RESTRICTED_STATUS_TRUE ||
                selectedSearchType.id ===
                  this.searchTypes.SEARCH_BY_RESTRICTED_STATUS_FALSE
              }
            />
            {this.state.validationErrors.searchKeyword ? (
              <div className="invalid-search-field">
                {this.state.validationErrors.searchKeyword}
              </div>
            ) : null}
          </Form.Group>
        </Form.Row>
        <Form.Row className="justify-content-center form-wrap">
          <Form.Group
            controlId="postSubmitButton"
            className="col-sm-2 post-form-group"
          >
            <Button
              bsPrefix="btn btn-info"
              type="submit"
              href="#"
              onClick={this.handleSearchClick}
            >
              Submit
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    );
  }
}

SearchBar.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(SearchBar);
