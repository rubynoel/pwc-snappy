import React, { Component, Fragment } from "react";
import CustomSelect from "./CustomSelect";


class SearchBar extends Component {
  constructor(props) {
    super(props);
  }
  state = { searchType: null, searchKeyword: null };

  handleSearchClick = searchParams => {
    this.props.dispatch(searchItems(searchParams));
  };

  handleKeywordChange = event => {
    console.log(`searching for keyword ${event.target.value}`);
    this.setState({ searchKeyword: event.target.value });
  };

  handleSearchTypeChange = event => {
    console.log(`setting search type ${JSON.stringify(event)}`);
    this.setState({ searchType: event.target.value });
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
    <Fragment>hi</Fragment>
  }
}


export default SearchBar;
