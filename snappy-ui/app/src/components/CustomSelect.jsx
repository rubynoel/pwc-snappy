import React, { Component } from "react";
import Select from "react-select";

class CustomSelect extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedOption: null
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    this.props.onChange(selectedOption);
  };

  render() {
    const { selectedOption } = this.props;
    console.log(`selectedOption is ${JSON.stringify(selectedOption)}`);
    let x = true;
    // console.log(`${this.props.defaultOptions}`);
    return (
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={this.props.defaultOptions}
        placeholder={this.props.placeholder}
        defaultValue={this.props.placeholder}
        // isClearable={x}
        isSearchable={x}
        styles={{ menu: base => ({ ...base, textAlign: "left" }) }}
      />
    );
  }
}

export default CustomSelect;
