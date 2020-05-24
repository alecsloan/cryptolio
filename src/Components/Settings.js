import FontAwesome from 'react-fontawesome';
import React, { Component } from 'react';
import SlidingPanel from "react-sliding-side-panel";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
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
                  onClick={event => this.props.toggleSettings()}
                  name='arrow-left'
                  pull='left'
              />
              <h2 className="settings-top">Settings</h2>
            </div>
          </SlidingPanel>
        </div>
    );
  }
}

export default Header;
