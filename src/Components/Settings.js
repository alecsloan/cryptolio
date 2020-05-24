import FontAwesome from 'react-fontawesome';
import React, { Component } from 'react';
import SlidingPanel from "react-sliding-side-panel";
import Toggle from 'react-toggle';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "react-toggle/style.css";
import '../styles/Settings.css';

class Header extends Component {
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
                          <label htmlFor='show1hChange'>Show 1h Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show1hChange}
                              id="show1hChange"
                              icons={false}
                              onChange={() => this.props.editSetting("show1hChange", !this.props.settings.show1hChange)} />
                      </div>
                      <div className="col-sm-4">
                          <label htmlFor='show24hChange'>Show 24h Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show24hChange}
                              id="show24hChange"
                              icons={false}
                              onChange={() => this.props.editSetting("show24hChange", !this.props.settings.show24hChange)} />
                      </div>
                      <div className="col-sm-4">
                          <label htmlFor='show7dChange'>Show 7d Change</label>
                          <Toggle
                              defaultChecked={this.props.settings.show7dChange}
                              id="show7dChange"
                              icons={false}
                              onChange={() => this.props.editSetting("show7dChange", !this.props.settings.show7dChange)} />
                      </div>
                  </div>
              </div>
            </div>
          </SlidingPanel>
        </div>
    );
  }
}

export default Header;
