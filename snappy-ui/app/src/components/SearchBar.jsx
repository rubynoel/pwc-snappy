import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustomSelect from './CustomSelect';
import { searchItems } from '../actions/SearchActions';

class SearchBar extends Component {
  searchTypes = {
    SEARCH_BY_COMPANY_NAME: 'companyName',
    SEARCH_BY_BUSINESS_NUMER: 'businessNumber',
    SEARCH_BY_RESTRICTED_STATUS: 'restrictedStatus',
  };

  state = { searchKeyword: null, selectedSearchType: null };

  handleSearchClick = (searchParams) => {
    this.props.dispatch(searchItems(searchParams));
  };

  handleKeywordChange = (event) => {
    console.log(`searching for keyword ${event.target.value}`);
    this.setState({ searchKeyword: event.target.value });
  };

  handleSearchTypeChange = (event) => {
    this.setState({
      selectedSearchType: { id: event.value, name: event.label },
    });
  };

  getSearchTypes = () => [
    { label: 'Company Name', value: this.searchTypes.SEARCH_BY_COMPANY_NAME },
    {
      label: 'Business Number',
      value: this.searchTypes.SEARCH_BY_BUSINESS_NUMER,
    },
    {
      label: 'Restricted Status',
      value: this.searchTypes.SEARCH_BY_RESTRICTED_STATUS,
    },
  ];

  render() {
    return (
      <Form className='search-form-area'>
        <Form.Row className='justify-content-center form-wrap'>
          <Form.Group
            controlId='searchType'
            className='col-md-8 post-form-group'
          >
            <Form.Label>Search By</Form.Label>
            <CustomSelect
              placeholder='Search By'
              onChange={this.handleSearchTypeChange}
              selectedOption={
                this.state.selectedSearchType
                  ? {
                    value: this.state.selectedSearchType.id,
                    label: this.state.selectedSearchType.name,
                  }
                  : this.getSearchTypes()[0]
              }
              defaultOptions={this.getSearchTypes()}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className='justify-content-center form-wrap'>
          <Form.Group
            controlId='searchKeyword'
            className='col-md-8 post-form-group'
          >
            <Form.Label>Search For</Form.Label>
            <Form.Control
              as='input'
              placeholder='Enter a keyword to search'
              onChange={this.handleKeywordChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className='justify-content-center form-wrap'>
          <Form.Group
            controlId='postSubmitButton'
            className='col-sm-2 post-form-group'
          >
            <Button
              bsPrefix='btn btn-info'
              type='submit'
              href='#'
              onClick={this.onSubmit}
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
  dispatch: PropTypes.func.isRequired,
};

export default connect()(SearchBar);
