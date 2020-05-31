import FontAwesome from 'react-fontawesome';
import React, { Component } from 'react';
import Select from "react-select";
import SlidingPanel from "react-sliding-side-panel";
import Toggle from 'react-toggle';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "react-toggle/style.css";
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
        <div>
          <SlidingPanel
              isOpen={this.props.showSettings}
              size={(window.innerWidth <= 760) ? 70 : 30}
              type="right"
          >
            <div>
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
                          <label className="pull-left" htmlFor="show1hChange">Show 1h Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show1hChange}
                              id="show1hChange"
                              icons={false}
                              onChange={() => this.props.editSetting('show1hChange', !this.props.settings.show1hChange)} />
                      </div>
                      <div className="col-sm-4">
                          <label className="pull-left" htmlFor="show24hChange">Show 24h Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show24hChange}
                              id="show24hChange"
                              icons={false}
                              onChange={() => this.props.editSetting('show24hChange', !this.props.settings.show24hChange)} />
                      </div>
                      <div className="col-sm-4">
                          <label className="pull-left" htmlFor="show7dChange">Show 7d Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show7dChange}
                              id="show7dChange"
                              icons={false}
                              onChange={() => this.props.editSetting('show7dChange', !this.props.settings.show7dChange)} />
                      </div>
                  </div>
                  <div className="col-12 currency-selector">
                      <label htmlFor="currency">Currency</label>
                      <Select
                          className="select add-input"
                          clearable={false}
                          closeOnSelect={true}
                          id="currency"
                          onChange={
                              e => {
                                  this.updateCurrency(e.value);
                                  this.props.editSetting('currency', e.value)
                              }
                          }
                          onSelectResetsInput={true}
                          options={this.getCurrencyOptions()}
                          placeholder={this.state.currency ? this.state.currency['currency'] + ' (' + this.state.currency['symbol'] + ')' : 'Select a currency'}
                          value={this.props.settings.currency}
                      />
                  </div>
                  <div className="row">
                      <div className="col-6">
                        <label htmlFor="limit">Add Dropdown Limit</label>
                      </div>
                      <div className="col-6">
                          <input
                              defaultValue={this.props.settings.limit}
                              id="limit"
                              max="2629"
                              min="1"
                              onInputCapture={event => this.props.editSetting('limit', event.target.value)}
                              type="number"
                          />
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-6">
                        <label htmlFor="sliderMax">Slider Max</label>
                      </div>
                      <div className="col-6">
                          <input
                              defaultValue={this.props.settings.sliderMax}
                              id="sliderMax"
                              min="100"
                              onInputCapture={event => this.props.editSetting('sliderMax', (event.target.value < 100) ? 100 : event.target.value)}
                              type="number"
                          />
                      </div>
                  </div>
              </div>
            </div>
          </SlidingPanel>
        </div>
    );
  }
}

export default Settings;
