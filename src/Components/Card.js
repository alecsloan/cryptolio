import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FontAwesome from 'react-fontawesome';
import Responsive from 'react-responsive';
import '../styles/Card.css';

const Mobile = props => <Responsive {...props} maxWidth={767} />;
const Default = props => <Responsive {...props} minWidth={768} />;

function MyBalance(props) {
  const holdings = props.holdings;

  if (holdings) {
    return(
      <div className="mt-2">
        My Balance: {(props.price * holdings).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2})}
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
      flip: false,
      simulate: 0
    };
  }

  toggleSettings(){
    this.setState({flip: !this.state.flip});
  }

  render() {
    let quote = this.props.coin.quote["USD"];

    let hourColor = String(quote.percent_change_1h).includes("-") ? 'red' : 'green';
    let dayColor = String(quote.percent_change_24h).includes("-") ? 'red' : 'green';
    let weekColor = String(quote.percent_change_7d).includes("-") ? 'red' : 'green';

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
            <img className="card-img-top center" src={'https://s2.coinmarketcap.com/static/img/coins/128x128/'+ this.props.coin.id +'.png'} alt={this.props.coin.name + ' Logo'}/>
            </div>
            <div className="card-body">
              <h4 className="card-title">{this.props.coin.name} ({this.props.coin.symbol})</h4>
              <div className="card-text">
                <div>Price: {quote.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2})}</div>
                <div>1h: <b className={hourColor}>{(quote.percent_change_1h * .01).toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2})}</b></div>
                <div>24h: <b className={dayColor}>{(quote.percent_change_24h * .01).toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2})}</b></div>
                <div>7d: <b className={weekColor}>{(quote.percent_change_7d * .01).toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2})}</b></div>
                <MyBalance price={quote.price} holdings={this.props.coin.holdings} />
              </div>
            </div>
          </div>
          {/*End of front*/}
          <div style={{display: back}}>
            <FontAwesome
              onClick={event => this.props.removeCrypto(this.props.coin.symbol)}
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
              <h4 className="card-title settings-title">{this.props.coin.name} ({this.props.coin.symbol})</h4>
              <p className="card-text">
              <label htmlFor="holdings">My Holdings:</label> <input ref="holdings" type="text" size="15" defaultValue={this.props.coin.holdings} onChange={e => this.props.updateHoldings(e, this.props.coin)}/>
              <input onChange={event => this.setState({simulate: event.target.value})} type="range" min="-100" max="100000" value={this.state.simulate} className="slider" id="simulater" style={{width: "80%"}} />
              <br />
              <label htmlFor="simulatePercent">Simulated Percent:</label> <input ref="simulatePercent" type="text" size="6" maxLength="6" value={this.state.simulate} onChange={event => this.setState({simulate: event.target.value})}/>%
              <br />
              Simulated Price: {(quote.price + ((quote.price) * (this.state.simulate * .01))).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}
              <br />
              Simulated Value: {((quote.price + ((quote.price) * (this.state.simulate * .01))) * (this.props.coin.holdings || 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}
              <br />
              Simulated Cap: {(this.props.coin.circulating_supply * (quote.price + (quote.price * (this.state.simulate * .01)))).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0})}
              </p>
            </div>
          </div>
        </div>
        </Default>
        <Mobile>
        <div className="card-small">
          <div onClick={event => this.toggleSettings()}>
            <div className="row">
              <img className="card-img-top-small" src={'https://s2.coinmarketcap.com/static/img/coins/128x128/'+ this.props.coin.id +'.png'} alt={this.props.coin.name + ' Logo'}/>
              <div className="col-5 coin-name">
                <b>{this.props.coin.name}</b>
                <small>{this.props.coin.symbol}</small>
              </div>
              <div className="col coin-value mr-2">
                <div className="mr-1">
                  <b className="p-1">{quote.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}</b>
                </div>
                <div className="row mr-1">
                  <div className="col p-1"> 1h <small className={hourColor}>{(quote.percent_change_1h * .01).toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2})}</small></div>
                  <div className="col p-1">24h <small className={dayColor}>{(quote.percent_change_24h * .01).toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2})}</small></div>
                  <div className="col p-1">7d <small className={weekColor}>{(quote.percent_change_7d * .01).toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2})}</small></div>
                </div>
              </div>
            </div>
          </div>
          {/*End of front*/}
          <div style={{display: back}}>
            <hr style={{marginTop: "5px"}}/>
            <div className="card-body-small">
              <h4 className="card-title settings-title">{this.props.coin.name} ({this.props.coin.symbol})</h4>
              <p className="card-text">
              <label htmlFor="holdings">My Holdings: </label> <input  id="holdings" type="text" size="15" defaultValue={this.props.coin.holdings} onChange={e => this.props.updateHoldings(e, this.props.coin)}/>
              <input onChange={event => this.setState({simulate: event.target.value})} type="range" min="-100" max="100000" value={this.state.simulate} className="slider" id="simulater" style={{width: "80%"}} />
              <br />
              <label htmlFor="simulatePercent">Simulated Percent:</label> <input ref="simulatePercent" type="text" size="6" maxLength="6" value={this.state.simulate} onChange={event => this.setState({simulate: event.target.value})}/>%
              <br />
              Simulated Price: {(quote.price + ((quote.price) * (this.state.simulate * .01))).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}
              <br />
              Simulated Value: {((quote.price + ((quote.price) * (this.state.simulate * .01))) * this.props.coin.holdings).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3})}
              <br />
              Simulated Cap: {(this.props.coin.circulating_supply * (quote.price + (quote.price * (this.state.simulate * .01)))).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0})}
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
