import FontAwesome from 'react-fontawesome';
import React, { Component } from 'react';
import SlidingPanel from "react-sliding-side-panel";
import Toggle from 'react-toggle';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "react-toggle/style.css";
import '../styles/Settings.css';
import Select from "react-select";

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
              type={'right'}
              isOpen={this.props.showSettings}
              size={(window.innerWidth <= 760) ? 70 : 30}
          >
            <div>
              <FontAwesome
                  className="back-arrow"
                  onClick={() => this.props.toggleShowSettings()}
                  name='arrow-left'
                  pull='left'
              />
              <h2 className="settings-top">Settings</h2>
              <div className="mt-5">
                  <div className="row m-0 w-100 mt-5">
                      <div className="col-sm-4">
                          <label className="pull-left" htmlFor='show1hChange'>Show 1h Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show1hChange}
                              id="show1hChange"
                              icons={false}
                              onChange={() => this.props.editSetting("show1hChange", !this.props.settings.show1hChange)} />
                      </div>
                      <div className="col-sm-4">
                          <label className="pull-left" htmlFor='show24hChange'>Show 24h Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show24hChange}
                              id="show24hChange"
                              icons={false}
                              onChange={() => this.props.editSetting("show24hChange", !this.props.settings.show24hChange)} />
                      </div>
                      <div className="col-sm-4">
                          <label className="pull-left" htmlFor='show7dChange'>Show 7d Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show7dChange}
                              id="show7dChange"
                              icons={false}
                              onChange={() => this.props.editSetting("show7dChange", !this.props.settings.show7dChange)} />
                      </div>
                  </div>
                  <div className="col-12 currency-selector">
                      <Select
                          ref="setCurrency"
                          className="select add-input color-black"
                          name="setCurrency"
                          placeholder={this.state.currency ? this.state.currency['currency'] + ' (' + this.state.currency['symbol'] + ')' : 'Select a currency'}
                          onChange={e => {this.updateCurrency(e.value); this.props.editSetting('currency', e.value)}}
                          onSelectResetsInput={true}
                          value={this.props.settings.currency}
                          clearable={false}
                          closeOnSelect={true}
                          options={this.getCurrencyOptions()}
                      />
                  </div>
              </div>
            </div>
          </SlidingPanel>
        </div>
    );
  }
}

export default Settings;
