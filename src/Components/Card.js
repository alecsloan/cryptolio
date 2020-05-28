import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FontAwesome from 'react-fontawesome';
import Responsive from 'react-responsive';
import '../styles/Card.css';

const Mobile = props => <Responsive {...props} maxWidth={767} />;
const Default = props => <Responsive {...props} minWidth={768} />;

function MyBalance(props) {
  const holdings = props.holdings || 0;

  if (holdings > 0) {
    return(
      <div className="mt-2">
        My Balance: {(props.price * holdings).toLocaleString('en-US', { style: 'currency', currency: props.currency, minimumFractionDigits: 2})}
      </div>
    );
  }

  return (
      <div></div>
  )
}

class Card extends Component {
  constructor(props){
    super(props);
    this.state ={
      coin: props.coin,
      flip: false,
      holdings: props.coin.holdings,
      settings: props.settings,
      simulate: 0
    };
  }

  getPercentChange(quote, period) {
    let showPeriodChange = false;
    let percentChange = 0;

    if (period === "1h") {
      showPeriodChange = this.state.settings.show1hChange;
      percentChange = quote.percent_change_1h;
    }
    else if (period === "24h") {
      showPeriodChange = this.state.settings.show24hChange;
      percentChange = quote.percent_change_24h;
    }
    else if (period === "7d") {
      showPeriodChange = this.state.settings.show7dChange;
      percentChange = quote.percent_change_7d;
    }

    if (showPeriodChange) {
      let hourColor = String(percentChange).includes("-") ? 'red' : 'green';

      let percent = <span>{(percentChange * .01).toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2})}</span>;

      if (window.innerWidth <= 760) {
        return (
          <div className="col p-1">
            {period}
            <small className={hourColor}>
              {percent}
            </small>
          </div>
        );
      }

      return (
        <div>
          {period}
          <b className={hourColor + " ml-2"}>
            {percent}
          </b>
        </div>
      )
    }
  }

  toggleSettings(){
    this.setState({flip: !this.state.flip});
  }

  render() {
    let quote = this.state.coin.quote[this.state.settings.currency];

    let front = this.state.flip ? 'none' : 'block';
    let back = this.state.flip ? 'block' : 'none';
    return(
      <div className="col-xs-12 col-sm-6 col-lg-4 card-container">
        <Default>
        <div className="card">
          <div style={{display: front}}>
            <div>
            <FontAwesome
              onClick={event => this.toggleSettings()}
              className='settings pull-right'
              name='gear'
              size='2x'
              spin
            />
            <img className="card-img-top center" src={'https://s2.coinmarketcap.com/static/img/coins/128x128/'+ this.state.coin.id +'.png'} alt={this.state.coin.name + ' Logo'}/>
            </div>
            <div className="card-body">
              <h4 className="card-title">{this.state.coin.name} ({this.state.coin.symbol})</h4>
              <div className="card-text">
                <div>Price: {quote.price.toLocaleString('en-US', { style: 'currency', currency: this.state.settings.currency, minimumFractionDigits: 2})}</div>
                {this.getPercentChange(quote, "1h")}
                {this.getPercentChange(quote, "24h")}
                {this.getPercentChange(quote, "7d")}
                <MyBalance currency={this.state.settings.currency} price={quote.price} holdings={this.state.holdings} />
              </div>
            </div>
          </div>
          {/*End of front*/}
          <div style={{display: back}}>
            <FontAwesome
              onClick={event => this.props.removeCrypto(this.state.coin.id)}
              className='settings pull-left'
              name='trash'
              size='2x'
            />
            <FontAwesome
              onClick={event => this.toggleSettings()}
              className='settings'
              name='save'
              size='2x'
            />
            <div className="card-body">
              <h4 className="card-title settings-title">{this.state.coin.name} ({this.state.coin.symbol})</h4>
              <p className="card-text">
              <label htmlFor="holdings">My Holdings:</label> <input ref="holdings" type="text" size="15" defaultValue={this.state.holdings} onChange={e => {this.setState({holdings: parseFloat(e.target.value).toFixed(9)}); this.props.updateHoldings(e, this.state.coin)}}/>
              <input onChange={event => this.setState({simulate: event.target.value})} type="range" min="-100" max="1000000" value={this.state.simulate} className="slider" id="simulater" style={{width: "80%"}} />
              <br />
              <label htmlFor="simulatePercent">Simulated Percent:</label> <input ref="simulatePercent" type="text" size="6" maxLength="6" value={this.state.simulate} onChange={event => this.setState({simulate: event.target.value})}/>%
              <br />
              Simulated Price: {(quote.price + ((quote.price) * (this.state.simulate * .01))).toLocaleString('en-US', { style: 'currency', currency: this.state.settings.currency, minimumFractionDigits: 3})}
              <br />
              Simulated Value: {((quote.price + ((quote.price) * (this.state.simulate * .01))) * (this.state.holdings) || 0).toLocaleString('en-US', { style: 'currency', currency: this.state.settings.currency, minimumFractionDigits: 3})}
              <br />
              Simulated Cap: {(this.state.coin.circulating_supply * (quote.price + (quote.price * (this.state.simulate * .01)))).toLocaleString('en-US', { style: 'currency', currency: this.state.settings.currency, minimumFractionDigits: 0})}
              </p>
            </div>
          </div>
        </div>
        </Default>
        <Mobile>
        <div className="card-small">
          <div onClick={event => this.toggleSettings()}>
            <div className="row">
              <img className="card-img-top-small" src={'https://s2.coinmarketcap.com/static/img/coins/128x128/'+ this.state.coin.id +'.png'} alt={this.state.coin.name + ' Logo'}/>
              <div className="col-5 coin-name">
                <b>{this.state.coin.name}</b>
                <small>{this.state.coin.symbol}</small>
              </div>
              <div className="col coin-value mr-2">
                <div className="mr-1">
                  <b className="p-1">{quote.price.toLocaleString('en-US', { style: 'currency', currency: this.state.settings.currency, minimumFractionDigits: 3})}</b>
                </div>
                <div className="row m-0">
                  {this.getPercentChange(quote, "1h")}
                  {this.getPercentChange(quote, "24h")}
                  {this.getPercentChange(quote, "7d")}
                </div>
              </div>
            </div>
          </div>
          {/*End of front*/}
          <div style={{display: back}}>
            <hr style={{marginTop: "5px"}}/>
            <div className="card-body-small">
              <h4 className="card-title settings-title">{this.state.coin.name} ({this.state.coin.symbol})</h4>
              <p className="card-text">
              <label htmlFor="holdings">My Holdings: </label> <input  id="holdings" type="text" size="15" defaultValue={this.state.holdings} onChange={e => this.props.updateHoldings(e, this.state.coin)}/>
              <input onChange={event => this.setState({simulate: event.target.value})} type="range" min="-100" max="100000" value={this.state.simulate} className="slider" id="simulater" style={{width: "80%"}} />
              <br />
              <label htmlFor="simulatePercent">Simulated Percent:</label> <input ref="simulatePercent" type="text" size="6" maxLength="6" value={this.state.simulate} onChange={event => this.setState({simulate: event.target.value})}/>%
              <br />
              Simulated Price: {(quote.price + ((quote.price) * (this.state.simulate * .01))).toLocaleString('en-US', { style: 'currency', currency: this.state.settings.currency, minimumFractionDigits: 3})}
              <br />
              Simulated Value: {((quote.price + ((quote.price) * (this.state.simulate * .01))) * this.state.holdings || 0).toLocaleString('en-US', { style: 'currency', currency: this.state.settings.currency, minimumFractionDigits: 3})}
              <br />
              Simulated Cap: {(this.state.coin.circulating_supply * (quote.price + (quote.price * (this.state.simulate * .01)))).toLocaleString('en-US', { style: 'currency', currency: this.state.settings.currency, maximumFractionDigits: 0, minimumFractionDigits: 0})}
              </p>
            </div>
            <FontAwesome
              onClick={event => this.toggleSettings()}
              className='settings-small pull-right'
              name='save'
              size='2x'
            />
            <FontAwesome
              onClick={event => this.props.removeCrypto(this.state.coin.symbol)}
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
