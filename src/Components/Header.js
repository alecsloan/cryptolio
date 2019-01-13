import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'font-awesome/css/font-awesome.min.css';

class Header extends Component {
  constructor(props){
    super(props);

    let coinOptArray = [];
    Object.values(this.props.coins).forEach((key) => {
      coinOptArray[key['rank']-1] = {'value': key['symbol'],'label': key['name'] + ' (' + key['symbol'] + ')'};
    });

    this.state = {
      coinOptions: coinOptArray,
      coinSelected: '',
      showAddSection: false
    }
  }

  toggleAddSection(){
    this.setState({showAddSection: !this.state.showAddSection});
  }

  render() {
    let showAddSection = this.state.showAddSection ? '' : 'none';

    return(
      <div className="row">
        <div className="col-12">
          <h2 className="title">
          <FontAwesome
            onClick={event => this.toggleAddSection()}
            className='add-section-icon'
            name='plus'
            pull='left'
          />
          CryptoDash
          </h2>
        </div>
        <div className="col-12" style={{display: showAddSection}}>
          <Select
            ref="addCoin"
            className="select addInput"
            name="addCoin"
            placeholder="Add a cryptocurrency"
            onChange={e => this.props.addCrypto(e.value)}
            onSelectResetsInput={true}
            value={this.state.coinSelected}
            clearable={false}
            closeOnSelect={true}
            options={this.state.coinOptions}
          />
        </div>


      </div>
    )
  }
}

export default Header;
