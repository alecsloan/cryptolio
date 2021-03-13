import Autocomplete from "@material-ui/lab/Autocomplete";
import Hotkeys from "react-hot-keys";
import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Header.css';
import IconButton from "@material-ui/core/IconButton";
import {Brightness2, Brightness7, KeyboardArrowDown, KeyboardArrowUp} from "@material-ui/icons";
import SettingsIcon from "@material-ui/icons/Settings";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAddSection: false,
      cryptoassetRef: null,
      inputValue: ""
    }
  }

  focusAddCryptoasset() {
    setTimeout(() => {
      document.getElementById('currency').focus();
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
              className={addIconClass}
              color="inherit"
              aria-label="mode"
              onClick={() => this.toggleAddSection()}
              title={addIconTitle}
            >
              {displayAddSection ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>

          CryptoDash

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
          <Autocomplete
              autoComplete={false}
              autoHighlight
              blurOnSelect
              clearOnBlur
              disablePortal={true}
              getOptionLabel={(option) => `${option.name} (${option.symbol})`}
              id="currency"
              inputValue={this.state.inputValue}
              onChange={
                (event, cryptoasset) => {
                  if (cryptoasset) {
                    this.props.addCrypto(cryptoasset.cmc_id, cryptoasset.cg_id, cryptoasset.symbol)

                    this.setState({
                      inputValue: ""
                    })
                  }
                }
              }
              onInputChange={
                  (event, value) => {
                      this.setState({
                          inputValue: value
                      })
                  }
              }
              options={this.props.cryptoAssetData}
              renderInput={(params) => <TextField {...params} label="Add Cryptoasset" variant="outlined" />}
              size="small"
              value={null}
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
