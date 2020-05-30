import FontAwesome from 'react-fontawesome';
import React, { Component } from 'react';
import Select from 'react-select';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coinSelected: "",
      displayAddSection: false
    }
  }

  getOptions() {
    var cryptoAssets = require("../cryptoassets.json");

    if (cryptoAssets) {
      let coinOptArray = [];

      var i = 0;

      Object.values(cryptoAssets.slice(0, this.props.limit)).forEach((cryptoAsset) => {
        coinOptArray[i] = {"value": cryptoAsset.id, "label": cryptoAsset.name + " (" + cryptoAsset.symbol + ")"};
        i++;
      });

      return coinOptArray;
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
          <Select
            className="select add-input"
            clearable={false}
            closeOnSelect={true}
            name="addCoin"
            onChange={e => this.props.addCrypto(e.value)}
            onSelectResetsInput={true}
            options={this.getOptions()}
            placeholder="Add a cryptoasset"
            value={this.state.coinSelected}
          />
        </div>
      </div>
    )
  }
}

export default Header;
