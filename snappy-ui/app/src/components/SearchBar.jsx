import React, { Component, Fragment } from "react";
import CustomSelect from "./CustomSelect";
import {searchItems} from "../actions/SearchActions";
import { Form, Button } from "react-bootstrap";

class SearchBar extends Component {
  constructor(props) {
    super(props);
  }
  state = { selectedSearchType: null, searchKeyword: null };

  handleSearchClick = searchParams => {
    this.props.dispatch(searchItems(searchParams));
  };

  handleKeywordChange = event => {
    console.log(`searching for keyword ${event.target.value}`);
    this.setState({ searchKeyword: event.target.value });
  };

  handleSearchTypeChange = event => {
    this.setState({ selectedSearchType: { id: event.value, name: event.label } });
  };

  searchTypes = {
    SEARCH_BY_COMPANY_NAME: 'companyName',
    SEARCH_BY_BUSINESS_NUMER: 'businessNumber',
    SEARCH_BY_RESTRICTED_STATUS: 'restrictedStatus',
  };

  getSearchTypes = () => {
    return [this.searchTypes.SEARCH_BY_COMPANY_NAME,this.searchTypes.SEARCH_BY_BUSINESS_NUMER,this.searchTypes.SEARCH_BY_RESTRICTED_STATUS].map(el => {
      return { value: el.locationId, label: el.locationName };
    });
  };

   
  render() {
   return (
              <Form className="post-form-area">
                
                <Form.Row className="justify-content-center form-wrap">
                  <Form.Group
                    controlId="searchType"
                    className="col-md-8 post-form-group"
                  >
                    <Form.Label>Search By</Form.Label>
                    <CustomSelect
                      placeholder="Search By"
                      onChange={this.handleSearchTypeChange}
                      selectedOption={
                        this.state.selectedSearchType
                          ? {
                              value: this.state.selectedSearchType.id,
                              label: this.state.selectedSearchType.name
                            }
                          : null
                      }
                      defaultOptions={this.getSearchTypes()}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row className="justify-content-center form-wrap">
                  <Form.Group
                    controlId="searchKeyword"
                    className="col-md-8 post-form-group"
                  >
                    <Form.Label>Search For</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter a keyword to search"
                      onChange={this.handleAddressChange}
                    />
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
                      onClick={this.onSubmit}
                    >
                      Submit
                    </Button>
                  </Form.Group>
                </Form.Row>
              </Form>);
  }
}


export default SearchBar;
