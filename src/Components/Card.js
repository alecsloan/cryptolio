import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FontAwesome from 'react-fontawesome';
import '../Card.css';

class Card extends Component {
  constructor(props){
    super(props);
    this.state ={
      flip: false
    };
  }

  toggleSettings(){
    this.setState({flip: !this.state.flip});
  }

  updateHoldings(event){
    let value = parseFloat(event.target.value).toFixed(9);
    if (value !== null && !isNaN(value)){
      //parseFloat again to get rid of trailing 0's
      console.log(parseFloat(value));
    }
  }

  render() {
    let color = String(this.props.coin.quotes.USD.percent_change_24h).includes("-") ? '#cc0000' : 'green';
    let front = this.state.flip ? 'hide' : 'show';
    let back = this.state.flip ? 'show' : 'hide';
    return(
      <div className="col-xs-12 col-sm-6 col-lg-4 card-container">
        <div className="card">
          <div className={front}>
            <div>
            <FontAwesome
              onClick={event => this.toggleSettings()}
              className='settings pull-right'
              name='gear'
              size='2x'
              spin
            />
            <img className="card-img-top center" src={'https://s2.coinmarketcap.com/static/img/coins/128x128/'+ this.props.coin.id +'.png'} alt={this.props.coin.name + ' Logo'}/>
            </div>
            <div className="card-body">
              <h4 className="card-title">{this.props.coin.name} ({this.props.coin.symbol})</h4>
              <p className="card-text">
                Price: ${this.props.coin.quotes.USD.price.toLocaleString()}
                <br/>
                24h: <b style={{color: color}}>{this.props.coin.quotes.USD.percent_change_24h}%</b>
                <br/>
                My Balance: $0
                </p>
            </div>
          </div>
          {/*End of front*/}
          <div className={back}>
            <FontAwesome
              onClick={event => this.toggleSettings()}
              className='settings pull-right'
              name='save'
              size='2x'
            />
            <FontAwesome
              onClick={event => this.props.removeCrypto(this.props.coin.symbol)}
              className='settings pull-left'
              name='trash'
              size='2x'
            />
            <div className="card-body">
              <h4 className="card-title settings-title">{this.props.coin.name} ({this.props.coin.symbol})</h4>
              <p className="card-text">
              <label htmlFor="holdings">My Holdings: </label> <input  id="holdings" type="text" size="15" onChange={this.updateHoldings}/>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Card;
