import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FontAwesome from 'react-fontawesome';
import Responsive from 'react-responsive';
import '../Card.css';

const Mobile = props => <Responsive {...props} maxWidth={767} />;
const Default = props => <Responsive {...props} minWidth={768} />;

class Card extends Component {
  constructor(props){
    super(props);
    this.state ={
      flip: false,
      simulate: 0
    };
  }

  toggleSettings(){
    this.setState({flip: !this.state.flip});
  }

  render() {
    let color = String(this.props.coin.quotes.USD.percent_change_24h).includes("-") ? '#cc0000' : 'green';
    let front = this.state.flip ? 'hide' : 'show';
    let back = this.state.flip ? 'show' : 'hide';
    return(
      <div className="col-xs-12 col-sm-6 col-lg-4 card-container">
        <Default>
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
                My Balance: ${(this.props.coin.quotes.USD.price * this.props.coin.holdings).toLocaleString()}
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
              <label htmlFor="holdings">My Holdings:</label> <input ref="holdings" type="text" size="15" defaultValue={this.props.coin.holdings} onChange={e => this.props.updateHoldings(e, this.props.coin)}/>
              </p>
              <input onChange={event => this.setState({simulate: event.target.value})} type="range" min="-100" max="100000" value={this.state.simulate} className="slider" id="simulater" style={{width: "80%"}} />
              <br />
              <label htmlFor="simulatePercent">Simulated Percent:</label> <input ref="simulatePercent" type="text" size="6" value={this.state.simulate} onChange={event => this.setState({simulate: event.target.value})}/>%
              <br />
              Simulated Price: {(this.props.coin.quotes.USD.price + ((this.props.coin.quotes.USD.price) * (this.state.simulate * .01))).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}
              <br />
              Simulated Value: {((this.props.coin.quotes.USD.price + ((this.props.coin.quotes.USD.price) * (this.state.simulate * .01))) * this.props.coin.holdings).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}
              <br />

              Simulated Cap: {(this.props.coin.circulating_supply * (this.props.coin.quotes.USD.price + (this.props.coin.quotes.USD.price * (this.state.simulate * .01)))).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0})}
            </div>
          </div>
        </div>
        </Default>
        <Mobile>
        <div className="card-small">
          <div onClick={event => this.toggleSettings()}>
            <div className="row">
              <img className="card-img-top-small" src={'https://s2.coinmarketcap.com/static/img/coins/128x128/'+ this.props.coin.id +'.png'} alt={this.props.coin.name + ' Logo'}/>
              <div className="col">
                ${this.props.coin.quotes.USD.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}
              </div>
              <div className="col">
                ${(this.props.coin.quotes.USD.price * this.props.coin.holdings).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}
              </div>
              <div className="col" style={{color: color}}>
                {this.props.coin.quotes.USD.percent_change_24h}%
              </div>
            </div>
          </div>
          {/*End of front*/}
          <div className={back}>
            <hr style={{marginTop: "5px"}}/>
            <div className="card-body-small">
              <h4 className="card-title settings-title">{this.props.coin.name} ({this.props.coin.symbol})</h4>
              <p className="card-text">
              <label htmlFor="holdings">My Holdings: </label> <input  id="holdings" type="text" size="15" defaultValue={this.props.coin.holdings} onChange={e => this.props.updateHoldings(e, this.props.coin)}/>
              </p>
            </div>
            <FontAwesome
              onClick={event => this.toggleSettings()}
              className='settings-small pull-right'
              name='save'
              size='2x'
            />
            <FontAwesome
              onClick={event => this.props.removeCrypto(this.props.coin.symbol)}
              className='settings-small pull-left'
              name='trash'
              size='2x'
            />
          </div>
        </div>
        </Mobile>
      </div>
    )
  }
}

export default Card;
