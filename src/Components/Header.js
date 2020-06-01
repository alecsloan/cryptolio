import Autocomplete from "@material-ui/lab/Autocomplete";
import FontAwesome from 'react-fontawesome';
import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cryptoassets: require("../cryptoassets.json").slice(0, props.limit),
      displayAddSection: false
    }
  }

  toggleAddSection(){
    this.setState({displayAddSection: !this.state.displayAddSection});
  }

  render() {
    let displayAddSection = "none";
    let addIconClass = "add-section-icon";
    let addIconTitle = "Show cryptoasset selector";

    if (this.state.displayAddSection) {
      displayAddSection = "block";
      addIconClass += " rotate";
      addIconTitle = "Hide cryptoasset selector";
    }

    return(
      <div className="header">
        <div className="col-12">
          <h2 className="title">
          <FontAwesome
            className={addIconClass}
            name="plus"
            onClick={() => this.toggleAddSection()}
            pull="left"
            title={addIconTitle}
          />
          CryptoDash
          <FontAwesome
            className="menu-icon"
            name="cogs"
            onClick={() => this.props.toggleShowSettings()}
            pull="right"
          />
          </h2>
        </div>
        <div className="col-12" style={{display: displayAddSection}}>
          <Autocomplete
              autoComplete={false}
              autoHighlight
              blurOnSelect
              className="w-100"
              clearOnBlur
              disablePortal={true}
              getOptionLabel={(option) => `${option.name} (${option.symbol})`}
              id="currency"
              onChange={
                (event, cryptoasset) => {
                  if (cryptoasset) {
                    this.props.addCrypto(cryptoasset.id)
                  }
                }
              }
              options={this.state.cryptoassets}
              renderInput={(params) => <TextField {...params} label="Add Cryptoasset" variant="outlined" />}
              size="small"
              value={null}
          />
        </div>
      </div>
    )
  }
}

export default Header;
