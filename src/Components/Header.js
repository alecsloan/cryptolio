import React, { Component } from 'react';
import Select from '/node_modules/react-select';
import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'font-awesome/css/font-awesome.min.css';

class Header extends Component {
  constructor(props){
    super(props);

    let coinOptArray = [];
    Object.values(this.props.coins).map((key) => {
      coinOptArray[key['rank']-1] = {'value': key['symbol'],'label': key['name'] + ' (' + key['symbol'] + ')'};
    });

    this.state = {
      coinOptions: coinOptArray,
      coinSelected: ''
    }
  }

  render() {
    return(
      <div className="row col-xs-12 Header">
        <div className="col-sm-6 col-xs-12">
          <h1 className="Title">My Dashboard</h1>
        </div>
        <div className="col-sm-6 col-xs-12 addSection">
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
