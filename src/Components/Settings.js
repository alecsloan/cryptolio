import Autocomplete from '@material-ui/lab/Autocomplete';
import Drawer from '@material-ui/core/Drawer';
import FontAwesome from 'react-fontawesome';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { Component } from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Settings.css';

class Settings extends Component {
    constructor(props) {
        super(props);

        var currencies = require('../currencies.json');

        this.state = {
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
        <div className="panel">
          <FontAwesome
              className="back-arrow"
              name="arrow-left"
              onClick={() => this.props.toggleShowSettings()}
              pull="left"
          />
          <h2 className="settings-top">Settings</h2>
          <div className="mt-5 settings-panel">
              <div className="m-0 w-100 mt-5 row">
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
                      autoHighlight
                      className="w-100"
                      disablePortal={true}
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
                      label="Dropdown Limit"
                      onInputCapture={event => this.props.editSetting('limit', event.target.value)}
                      size="small"
                      type="number"
                      value={this.props.settings.limit}
                      variant="outlined"
                  />
              </div>
              <div className="row">
                  <TextField
                      InputLabelProps={{
                          shrink: true,
                      }}
                      label="Slider Max"
                      onInputCapture={event => this.props.editSetting('sliderMax', (event.target.value < 100) ? 100 : event.target.value)}
                      size="small"
                      type="number"
                      value={this.props.settings.sliderMax}
                      variant="outlined"
                  />
              </div>
              <div className="row">
                  <div className="col-sm-6">
                      <FormControlLabel
                          control={
                              <Switch
                                  color="primary"
                                  defaultChecked={this.props.settings.addDropdownHideable}
                                  onChange={() => this.props.editSetting('addDropdownHideable', !this.props.settings.addDropdownHideable)}
                              />
                          }
                          label="Always Show Add Dropdown"
                          labelPlacement="top"
                          value="top"
                      />
                  </div>
                  <div className="col-sm-6">
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
          </div>
        </div>
      </Drawer>
    );
  }
}

export default Settings;
