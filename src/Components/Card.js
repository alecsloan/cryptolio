import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FontAwesome from 'react-fontawesome';
import '../styles/Card.css';
import TextField from "@material-ui/core/TextField";
import {InputAdornment, Slider} from "@material-ui/core";

function MyBalance(props) {
  if (props.holdings > 0 && props.settings.showCardBalances) {
    return(
      <div className="mt-2">
        My Balance: {(props.price * props.holdings).toLocaleString(window.navigator.language, { style: 'currency', currency: props.settings.currency, minimumFractionDigits: 2})}
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
      holdings: props.asset.holdings,
      settings: props.settings,
      simulatedPercentChange: 0,
      simulatedPrice: props.asset.price,
      simulatedValue: props.asset.holdings * props.asset.price,
      simulatedCap: this.props.asset.circulating_supply * props.asset.price
    };
  }

  getCurrencySymbol() {
    return (0).toLocaleString(
        window.navigator.language,
        {
          style: 'currency',
          currency: this.state.settings.currency,
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        }
    ).replace(/\d/g, '').trim()
  }

  getPercentChange(percentChange, period) {
    let showPeriodChange = false;

    if (period === "1h") {
      showPeriodChange = this.state.settings.show1hChange;
    }
    else if (period === "24h") {
      showPeriodChange = this.state.settings.show24hChange;
    }
    else if (period === "7d") {
      showPeriodChange = this.state.settings.show7dChange;
    }

    if (showPeriodChange) {
      let hourColor = String(percentChange).includes("-") ? 'red' : 'green';

      let percent = <span>{(percentChange * .01).toLocaleString(window.navigator.language, {style: 'percent', minimumFractionDigits: 2})}</span>;

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

  getLocalizedPrice(price) {
    if (!price)
      return 0;

    var maxDigits;

    if (price < this.props.settings.decimals4) {
      maxDigits = 4;
    }
    else if (price < this.props.settings.decimals3) {
      maxDigits = 3;
    }
    else if (price < this.props.settings.decimals2) {
      maxDigits = 2;
    }
    else {
      maxDigits = 0;
    }

    return price.toLocaleString(
        window.navigator.language,
        {
          currency: this.state.settings.currency,
          maximumFractionDigits: maxDigits,
          minimumFractionDigits: maxDigits
        }
    );
  }

  toggleSettings(){
    this.setState({flip: !this.state.flip});
  }

  render() {
    let price = this.props.asset.price;

    let front = this.state.flip ? 'none' : '';
    let back = this.state.flip ? '' : 'none';
    return(
      <div className="col-xs-12 col-sm-6 col-lg-4 card-container">
        <div className="card">
          <div className={(window.innerWidth <= 760) ? "row" : ""} style={{display: front}} onClick={() => this.toggleSettings()}>
            <div className={(window.innerWidth <= 760) ? "ml-2 w-50" : ""}>
            <FontAwesome
              className='settings pull-right'
              name='gear'
              onClick={() => this.toggleSettings()}
              size='2x'
              spin
            />
            <img
                alt={this.props.asset.name + ' Logo'}
                className="card-img-top center"
                src={this.props.asset.imageURL}
            />
            <h4 className="card-title">{this.props.asset.name} ({this.props.asset.symbol})</h4>
            </div>
            <div className="card-body">
              <div className="card-text">
                <div>Price: {this.getCurrencySymbol() + this.getLocalizedPrice(price)}</div>
                {this.getPercentChange(this.props.asset.percent_change_1h, "1h")}
                {this.getPercentChange(this.props.asset.percent_change_24h, "24h")}
                {this.getPercentChange(this.props.asset.percent_change_7d, "7d")}
                <MyBalance holdings={this.state.holdings} price={price} settings={this.state.settings} />
              </div>
            </div>
          </div>
          <div className="back" style={{display: back}}>
            <FontAwesome
              className='settings pull-left visible'
              name='trash'
              onClick={() => this.props.removeCrypto(this.props.asset.symbol)}
              size='2x'
            />
            <FontAwesome
              className='settings visible'
              name='save'
              onClick={() => this.toggleSettings()}
              size='2x'
            />
            <div className="card-body">
              <h4 className="card-title settings-title">
                {this.props.asset.name + "(" + this.props.asset.symbol + ")"}
              </h4>

              <div className="card-text">
                <div className="mb-2">Price: {this.getCurrencySymbol() + this.getLocalizedPrice(price)}</div>

                <TextField
                    label="My Holdings"
                    onChange={
                      event => {
                        this.setState({
                          holdings: parseFloat(event.target.value)
                        });
                        this.props.updateHoldings(event, this.props.asset)
                      }
                    }
                    size={"small"}
                    value={this.state.holdings || 0}
                    variant="outlined"
                />

                <MyBalance holdings={this.state.holdings} price={price} settings={this.state.settings} />

                <hr />

                <TextField
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    label="Simulated Percent"
                    onChange={
                      event =>
                          this.setState({
                              simulatedPercentChange: event.target.value,
                              simulatedPrice: (((event.target.value * .01) * price) + price),
                              simulatedValue: ((((event.target.value * .01) * price) + price) * this.state.holdings),
                              simulatedCap: ((((event.target.value * .01) * price) + price) * this.props.asset.circulating_supply)
                          })
                    }
                    size={"small"}
                    value={this.getLocalizedPrice(this.state.simulatedPercentChange) || ""}
                    variant="outlined"
                />

                <Slider
                    className="slider"
                    max={this.state.settings.sliderMax}
                    min={-100}
                    onChange={
                      (event, value) =>
                          this.setState({
                              simulatedPercentChange: value,
                              simulatedPrice: (((value * .01) * price) + price),
                              simulatedValue: ((((value * .01) * price) + price) * this.state.holdings),
                              simulatedCap: ((((value * .01) * price) + price) * this.props.asset.circulating_supply)
                          })
                    }
                    valueLabelFormat={
                        value => {
                          if (!value)
                            return "0%";

                          return this.getLocalizedPrice(value) + "%";
                        }
                    }
                    valueLabelDisplay="auto"
                    value={this.state.simulatedPercentChange}
                />

                <TextField
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{this.getCurrencySymbol()}</InputAdornment>,
                    }}
                    label="Simulated Price"
                    onChange={
                        event =>
                          this.setState({
                              simulatedPercentChange: (100 * ((event.target.value - price) / price)),
                              simulatedPrice: event.target.value,
                              simulatedValue: (event.target.value * this.state.holdings),
                              simulatedCap: (event.target.value * this.props.asset.circulating_supply)
                          })
                    }
                    size={"small"}
                    value={this.getLocalizedPrice(this.state.simulatedPrice)}
                    variant="outlined"
                />

                <TextField
                  InputProps={{
                      startAdornment: <InputAdornment position="start">{this.getCurrencySymbol()}</InputAdornment>,
                  }}
                  label="Simulated Value"
                  onChange={
                      event =>
                          this.setState({
                              simulatedPercentChange: (100 * (((event.target.value / this.state.holdings) - price) / price)),
                              simulatedPrice: (event.target.value / this.state.holdings),
                              simulatedValue: event.target.value,
                              simulatedCap: ((event.target.value / this.state.holdings) * this.props.asset.circulating_supply)
                          })
                  }
                  size={"small"}
                  value={this.getLocalizedPrice(this.state.simulatedValue)}
                  variant="outlined"
                />

                <TextField
                  InputProps={{
                      startAdornment: <InputAdornment position="start">{this.getCurrencySymbol()}</InputAdornment>,
                  }}
                  label="Simulated Cap"
                  onChange={
                      event =>
                          this.setState({
                              simulatedPercentChange: (100 * ((event.target.value - (this.props.asset.circulating_supply * price)) / (this.props.asset.circulating_supply * price))),
                              simulatedPrice: (event.target.value / this.props.asset.circulating_supply),
                              simulatedValue: ((event.target.value / this.props.asset.circulating_supply) * this.state.holdings),
                              simulatedCap: event.target.value
                          })
                  }
                  size={"small"}
                  value={this.getLocalizedPrice(this.state.simulatedCap)}
                  variant="outlined"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Card;
