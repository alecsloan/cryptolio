import Hotkeys from "react-hot-keys";
import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Header.css';
import IconButton from "@material-ui/core/IconButton";
import {
  Brightness2,
  Brightness7,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Refresh,
  Settings as SettingsIcon
} from "@material-ui/icons";
import VirtualizedCryptoassetAutocomplete from "./VirtualizedCryptoassetAutocomplete";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAddSection: false,
      cryptoassetRef: null
    }
  }

  focusAddCryptoasset() {
    setTimeout(() => {
      document.getElementById('cryptoassets').focus();
    }, 50);
  }

  getPortfolioBalance() {
    if (!this.props.settings.showPortfolioBalance || !this.props.assets)
      return;

    var balance = 0;

    Object.entries(this.props.assets).forEach(([id, asset]) => {
      if (asset.holdings > 0 && asset.price) {
        balance += asset.price * asset.holdings;
      }
    });

    return <span>: {(balance).toLocaleString(window.navigator.language, { style: 'currency', currency: this.props.settings.currency, minimumFractionDigits: 2})}</span>;
  }

  toggleAddSection(){
    this.setState({displayAddSection: !this.state.displayAddSection});
  }

  render() {
    let displayAddSection = "none";
    let addIconClass = "add-section-icon";
    let addIconTitle = "Show cryptoasset selector";

    if (!this.props.settings.addDropdownHideable) {
      addIconClass += " invisible";
      displayAddSection = "block";
    }
    else if (this.state.displayAddSection) {
      displayAddSection = "block";
      addIconClass += " rotate";
      addIconTitle = "Hide cryptoasset selector";
    }

    return(
      <div className="header">
        <div className="col-12">
          <h2 className="title">
            <IconButton
              aria-label="mode"
              className="pull-left"
              color="inherit"
              onClick={() => this.props.refreshData()}
              title="Refresh Asset Data"
            >
              <Refresh />
            </IconButton>

            <IconButton
              className={addIconClass}
              color="inherit"
              aria-label="mode"
              onClick={() => this.toggleAddSection()}
              title={addIconTitle}
            >
              {displayAddSection ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>

            Cryptolio

            <IconButton
              className="pull-right"
              color="inherit"
              aria-label="mode"
              onClick={() => this.props.toggleShowSettings()}
            >
               <SettingsIcon />
            </IconButton>

            <IconButton
              className="pull-right"
              color="inherit"
              aria-label="mode"
              onClick={() => this.props.editSetting('theme', this.props.settings.theme.palette.type)}
            >
                {this.props.settings.theme.palette.type === "dark" ? <Brightness7 /> : <Brightness2 />}
            </IconButton>

            {this.getPortfolioBalance()}

          </h2>

        </div>
        <div className="col-12" style={{display: displayAddSection}}>
          <VirtualizedCryptoassetAutocomplete
            addCrypto={this.props.addCrypto.bind(this)}
            options={this.props.cryptoAssetData}
          />
        </div>
        <Hotkeys
          keyName="/"
          onKeyDown={this.focusAddCryptoasset.bind(this)}
        />
      </div>
    )
  }
}

export default Header;
