import React, { Component, Fragment } from "react";
import CustomSelect from "./CustomSelect";

import { connect } from "react-redux";

class SearchBar extends Component {
  constructor(props) {
    super(props);
  }
  state = { searchFieldName: null, searchFieldValue: null };

  handleSearchClick = searchParams => {
    this.props.dispatch(doSearch());
    this.props.dispatch(searchItems(searchParams));
  };

  handleKeywordChange = event => {
    console.log(`searching for keyword ${event.target.value}`);
    this.setState({ keyword: event.target.value });
  };

  handleLocationChange = event => {
    console.log(`setting location ${JSON.stringify(event)}`);
    //this.setState({ location: { id: event.value, name: event.label } });
    this.props.dispatch(
      changeSelectedLocation({
        location: { id: event.value, name: event.label }
      })
    );
  };

  handleCategoryChange = event => {
    console.log(`searching for category ${JSON.stringify(event)}`);
    //this.setState({ category: { id: event.value, name: event.label } });
    this.props.dispatch(
      changeSelectedCategory({
        category: { id: event.value, name: event.label }
      })
    );
  };

  getLocations = () => {
    //console.log(`getting locations lov ${this.props.locationsLOV}`);

    return this.props &&
      this.props.locationsLOV &&
      this.props.locationsLOV.items
      ? this.props.locationsLOV.items
          .map(el => {
            return { value: el.locationId, label: el.locationName };
          })
          .sort((el1, el2) => el1.label.localeCompare(el2.label))
      : [];
  };

  getPostCategories = () => {
    //console.log(`getting locations lov ${this.props.locationsLOV}`);

    return this.props &&
      this.props.categoriesLOV &&
      this.props.categoriesLOV.items
      ? this.props.categoriesLOV.items
          .map(el => {
            return { value: el.categoryId, label: el.categoryName };
          })
          .sort((el1, el2) => el1.label.localeCompare(el2.label))
      : [];
  };

  
  render() {
  }
}

const mapStateToProps = state => {
  return {
   location: state.searchBarView.selectedLocation,
    category: state.searchBarView.selectedCategory,
    locationsLOV: state.lovData.location,
    categoriesLOV: state.lovData.category,
    activeView: state.viewContext.activeView,
    totalResults: state.searchResults.total
  };
};

export default connect(mapStateToProps)(SearchBar);
