import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, { Component } from 'react';
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

class IntervalSelector extends Component {
  getMenuItems(min) {
    var menuItems = [];

    if (min < 60000) {
      menuItems.push(<MenuItem key="seconds" value="1000">Seconds</MenuItem>);
    }
    else if (min < 3600000) {
      menuItems.push(<MenuItem key="minutes" value="60000">Minutes</MenuItem>);
    }

    menuItems.push(<MenuItem key="hours" value="3600000">Hours</MenuItem>);

    return menuItems;
  }

  constructor(props) {
    super(props);

    var milliseconds;
    var value;

    if (this.props.fetchInterval < 60000) {
      milliseconds = 1000;
      value = this.props.fetchInterval / 1000;
    }
    else if (this.props.fetchInterval < 3600000) {
      milliseconds = 60000;
      value = this.props.fetchInterval / 60000;
    }
    else {
      milliseconds = 3600000;
      value = this.props.fetchInterval / 3600000;
    }

    this.state = {
      milliseconds: milliseconds,
      value: value
    }
  }

  onChange(value, milliseconds) {
    if (!milliseconds)
      milliseconds = this.state.milliseconds;

    if (!value) {
      value = this.state.value;
    }

    this.setState({
      milliseconds: milliseconds,
      value: value
    })

    return this.props.onChange(milliseconds * value);
  }

  render() {
    return(
        <FormControlLabel
            control={
              <div className="row">
                <TextField
                    className="col mr-2"
                    defaultValue={this.state.value || 1}
                    onInputCapture={event => this.onChange(event.target.value, null)}
                    size={this.props.size || "small"}
                    type="number"
                    variant={this.props.variant || "outlined"}
                />
                <Select
                    className="col-sm-8"
                    onChange={event => this.onChange(null, event.target.value)}
                    value={this.state.milliseconds || 1000}
                    variant={this.props.variant || "outlined"}
                >
                  {this.getMenuItems(60000)}
                </Select>
              </div>
            }
            label={this.props.label || "Label"}
            labelPlacement={this.props.labelPlacement || "left"}
        />
    )
  }
}

export default IntervalSelector;
