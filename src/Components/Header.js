import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';
import 'font-awesome/css/font-awesome.min.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coinSelected: '',
      displayAddSection: false
    }
  }

  getOptions() {
    if (this.props.coins) {
      let coinOptArray = [];

      Object.values(this.props.coins).forEach((key) => {
        coinOptArray[key['cmc_rank'] - 1] = {'value': key['symbol'], 'label': key['name'] + ' (' + key['symbol'] + ')'};
      });

      return coinOptArray;
    }
  }

  toggleAddSection(){
    this.setState({displayAddSection: !this.state.displayAddSection});
  }

  render() {
    let displayAddSection = 'none';
    let addIconClass = 'add-section-icon';
    let addIconTitle = 'Show cryptocurrency selector';

    if (this.state.displayAddSection) {
      displayAddSection = 'block';
      addIconClass += ' rotate';
      addIconTitle = 'Hide cryptocurrency selector';
    }

    return(
      <div className="header">
        <div className="col-12">
          <h2 className="title">
          <FontAwesome
            onClick={event => this.toggleAddSection()}
            className={addIconClass}
            name='plus'
            pull='left'
            title={addIconTitle}
          />
          CryptoDash
          <FontAwesome
            onClick={event => console.log("will toggle menu")}
            className='menu-icon'
            name='cogs'
            pull='right'
          />
          </h2>
        </div>
        <div className="col-12" style={{display: displayAddSection}}>
          <Select
            ref="addCoin"
            className="select add-input"
            name="addCoin"
            placeholder="Add a cryptocurrency"
            onChange={e => this.props.addCrypto(e.value)}
            onSelectResetsInput={true}
            value={this.state.coinSelected}
            clearable={false}
            closeOnSelect={true}
            options={this.getOptions()}
          />
        </div>
      </div>
    )
  }
}

export default Header;
