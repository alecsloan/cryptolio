import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownloadOutlined';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import Drawer from '@material-ui/core/Drawer';
import exportFromJSON from 'export-from-json'
import FontAwesome from 'react-fontawesome';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Settings.css';
import IntervalSelector from "./IntervalSelector";

class Settings extends Component {
    constructor(props) {
        super(props);

        var currencies = require('../currencies.json');

        var cmc_logo = "https://s2.coinmarketcap.com/static/cloud/img/coinmarketcap";
        var cg_logo = "https://static.coingecko.com/s/coingecko-logo-d13d6bcceddbb003f146b33c2f7e8193d72b93bb343d38e392897c3df3e78bdd.png";

        if (this.props.theme.palette.type === "dark") {
            cmc_logo += "_white";
            cg_logo = "https://static.coingecko.com/s/coingecko-logo-white-3f2aeb48e13428b7199395259dbb96280bf47ea05b2940ef7d3e87c61e4d8408.png";
        }

        cmc_logo += "_1.svg";

        this.state = {
            cg_logo: cg_logo,
            cmc_logo: cmc_logo,
            currencies: currencies,
            currency: currencies.find(currency => currency.code === this.props.settings.currency)
        }
    }

    getCurrencyOptions() {
        if (this.state.currencies) {
            let currencyOptArray = [];

            Object.values(this.state.currencies).forEach((currency) => {
                currencyOptArray.push({'value': currency['code'], 'label': currency['currency'] + ' (' + currency['symbol'] + ')'});
            });

            return currencyOptArray;
        }
    }

    updateCurrency(currencyCode) {
        this.setState({
            currency: this.state.currencies.find(currency => currency.code === currencyCode)
        })
    }

  render() {
    return (
      <Drawer
          anchor="right"
          open={this.props.showSettings}
          onClose={() => this.props.toggleShowSettings()}
      >
          <FontAwesome
              className="back-arrow"
              name="arrow-left"
              onClick={() => this.props.toggleShowSettings()}
              pull="left"
          />
          <h2 className="settings-top">Settings</h2>
          <div className="settings-panel">
              <div className="row">
                  <FormControlLabel
                      className="w-100"
                      control={
                          <Select
                              value={this.props.settings.datasource}
                              onChange={event => this.props.editSetting('datasource', event.target.value)}
                          >
                              <MenuItem value="coingecko"><img alt="CoinGecko" src={this.state.cg_logo} /></MenuItem>
                              <MenuItem value="coinmarketcap"><img alt="CoinMarketCap" src={this.state.cmc_logo} /></MenuItem>
                          </Select>
                      }
                      label="Datasource"
                      labelPlacement="top"
                      value="top"
                  />
              </div>
              <div className="row">
                  <div className="col-sm-6">
                      <input
                          accept="application/json"
                          className="d-none"
                          id="upload"
                          onInputCapture={event => this.props.uploadData(event.target.files[0])}
                          type="file"
                      />
                      <label htmlFor="upload">
                          <Button
                              variant="contained"
                              color="primary"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                          >
                              Upload Data
                          </Button>
                      </label>
                  </div>
                  <div className="col-sm-6">
                      <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CloudDownloadIcon />}
                          onClick={() => exportFromJSON({ data: this.props.data, fileName: 'cryptodash_data', exportType: 'json' })}
                      >
                          Download Data
                      </Button>
                  </div>
              </div>
              <div className="m-0 w-100 mt-4 row">
                  <div className="col-sm-4">
                      <FormControlLabel
                          control={
                              <Switch
                                  color="primary"
                                  defaultChecked={this.props.settings.show1hChange}
                                  onChange={() => this.props.editSetting('show1hChange', !this.props.settings.show1hChange)}
                              />
                          }
                          label="Show 1h Change"
                          labelPlacement="top"
                          value="top"
                      />
                  </div>
                  <div className="col-sm-4">
                      <FormControlLabel
                          control={
                              <Switch
                                  color="primary"
                                  defaultChecked={this.props.settings.show24hChange}
                                  onChange={() => this.props.editSetting('show24hChange', !this.props.settings.show24hChange)}
                              />
                          }
                          label="Show 24 Change"
                          labelPlacement="top"
                          value="top"
                      />
                  </div>
                  <div className="col-sm-4">
                      <FormControlLabel
                          control={
                              <Switch
                                  color="primary"
                                  defaultChecked={this.props.settings.show7dChange}
                                  onChange={() => this.props.editSetting('show7dChange', !this.props.settings.show7dChange)}
                              />
                          }
                          label="Show 7d Change"
                          labelPlacement="top"
                          value="top"
                      />
                  </div>
              </div>
              <div className="currency-selector row">
                  <Autocomplete
                      autoComplete={false}
                      autoHighlight
                      className="w-100"
                      clearOnBlur
                      getOptionLabel={(option) => `${option.currency} (${option.symbol})`}
                      id="currency"
                      onChange={
                          (event, currency) => {
                              if (currency) {
                                  this.updateCurrency(currency.code);
                                  this.props.editSetting('currency', currency.code)
                              }
                          }
                      }
                      options={this.state.currencies}
                      renderInput={(params) => <TextField {...params} label="Currency" variant="outlined" />}
                      size="small"
                      value={this.state.currency}
                  />
              </div>
              <div className="row">
                  <TextField
                      InputLabelProps={{
                          shrink: true,
                      }}
                      label="Simulated Percent Slider Max"
                      onInputCapture={event => this.props.editSetting('sliderMax', (event.target.value < 100) ? 100 : event.target.value)}
                      size="small"
                      type="number"
                      value={this.props.settings.sliderMax}
                      variant="outlined"
                  />
              </div>
              <div className="row">
                  <div className="col-sm-4">
                      <FormControlLabel
                          control={
                              <Switch
                                  color="primary"
                                  defaultChecked={this.props.settings.addDropdownHideable}
                                  onChange={() => this.props.editSetting('addDropdownHideable', !this.props.settings.addDropdownHideable)}
                              />
                          }
                          label="Add Dropdown Collapsable"
                          labelPlacement="top"
                          value="top"
                      />
                  </div>
                  <div className="col-sm-4">
                      <FormControlLabel
                          control={
                              <Switch
                                  color="primary"
                                  defaultChecked={this.props.settings.showCardBalances}
                                  onChange={() => this.props.editSetting('showCardBalances', !this.props.settings.showCardBalances)}
                              />
                          }
                          label="Show AssetCard Balance"
                          labelPlacement="top"
                          value="top"
                      />
                  </div>
                  <div className="col-sm-4">
                      <FormControlLabel
                          control={
                              <Switch
                                  color="primary"
                                  defaultChecked={this.props.settings.showPortfolioBalance}
                                  onChange={() => this.props.editSetting('showPortfolioBalance', !this.props.settings.showPortfolioBalance)}
                              />
                          }
                          label="Show Portfolio Balance"
                          labelPlacement="top"
                          value="top"
                      />
                  </div>
              </div>
              <IntervalSelector
                  value={this.props.settings.fetchInterval || 300000}
                  label="Data Fetch Interval"
                  labelPlacement="top"
                  max="Hour"
                  min="Minute"
                  onChange={value => this.props.editSetting('fetchInterval', value)}
                  selectFieldClasses="col-8"
                  size="small"
                  textFieldClasses="col-4"
                  variant="outlined"
              />
              <IntervalSelector
                value={this.props.settings.autoHideFetchNotification}
                label="Data Fetch Notification Timeout"
                labelPlacement="top"
                max="Minute"
                min="Second"
                onChange={value => this.props.editSetting('autoHideFetchNotification', value)}
                selectFieldClasses="col-8"
                size="small"
                textFieldClasses="col-4"
                variant="outlined"
              />
              <div className="row">
                  <TextField
                      InputLabelProps={{
                          shrink: true,
                      }}
                      label="Show 2 Decimals When Price Under"
                      onInputCapture={event => this.props.editSetting('decimals2', event.target.value)}
                      size="small"
                      type="number"
                      value={this.props.settings.decimals2}
                      variant="outlined"
                  />
              </div>
              <div className="row">
                  <TextField
                      InputLabelProps={{
                          shrink: true,
                      }}
                      label="Show 3 Decimals When Price Under"
                      onInputCapture={event => this.props.editSetting('decimals3', event.target.value)}
                      size="small"
                      type="number"
                      value={this.props.settings.decimals3}
                      variant="outlined"
                  />
              </div>
              <div className="row">
                  <TextField
                      InputLabelProps={{
                          shrink: true,
                      }}
                      label="Show 4 Decimals When Price Under"
                      onInputCapture={event => this.props.editSetting('decimals4', event.target.value)}
                      size="small"
                      type="number"
                      value={this.props.settings.decimals4 || ""}
                      variant="outlined"
                  />
              </div>
              <div>
                  <h6>{`Assets Available: ${this.props.data.cryptoassets.length}`}</h6>
                  Version: {process.env.REACT_APP_VERSION} |
                  <a className="ml-2 mr-2 text-white" href="https://github.com/alecsloan/cryptodash" rel="noopener noreferrer" target="_blank">
                      <FontAwesome
                          className='ml-2 mr-1'
                          name='github'
                          size='2x'
                      />
                  </a> |
                  Caveat Emptor
              </div>
          </div>
      </Drawer>
    );
  }
}

export default Settings;
