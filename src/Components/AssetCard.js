import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FontAwesome from 'react-fontawesome';
import '../styles/Card.css';
import TextField from "@material-ui/core/TextField";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  InputAdornment,
  Slider,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DataGrid } from '@material-ui/data-grid';
import EditableTable from "./EditableTable";


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

class AssetCard extends Component {
  constructor(props){
    super(props);
    this.state ={
      flip: false,
      settings: props.settings,
      simulatedPercentChange: 0,
      simulatedPrice: props.asset.price,
      simulatedValue: props.asset.holdings * props.asset.price,
      simulatedCap: this.props.asset.circulating_supply * props.asset.price,
      interestSimulation: {
        interest: 0,
        simulatedPrice: props.asset.price
      }
    };
  }

  getCurrencySymbol() {
    return (0).toLocaleString(
        window.navigator.language,
        {
          style: 'currency',
          currency: this.props.settings.currency,
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        }
    ).replace(/\d/g, '').trim()
  }

  getPercentChange(percentChange, period) {
    let showPeriodChange = false;

    if (period === "1h") {
      showPeriodChange = this.props.settings.show1hChange;
    }
    else if (period === "24h") {
      showPeriodChange = this.props.settings.show24hChange;
    }
    else if (period === "7d") {
      showPeriodChange = this.props.settings.show7dChange;
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

  getLocalizedNumber(number) {
    if (!number) {
      return "";
    }

    return number.toLocaleString(
      window.navigator.language
    );
  }

  getLocalizedPrice(price) {
    if (!price) {
      return "";
    }

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
          currency: this.props.settings.currency,
          maximumFractionDigits: maxDigits,
          minimumFractionDigits: maxDigits
        }
    );
  }

  setRows(rows) {
    this.setState({
      ...this.state,
      exitPlan: {
        rows
      }
    })
  }

  toggleSettings(){
    this.setState({flip: !this.state.flip});
  }

    render() {
    let price = this.props.asset.price;

    let front = this.state.flip ? 'none' : '';
    let back = this.state.flip ? '' : 'none';

    var yearlyInterest = this.props.asset.holdings * (this.state.interestSimulation.interest * .01);

    const columns = [
      { field: 'id', headerName: this.props.asset.symbol + " Earned", width: "33%", sortable: false },
      { field: 'amount', headerName: 'Amount', width: "33%", sortable: false },
      { field: 'value', headerName: this.getCurrencySymbol() + " Value", width: "33%", sortable: false },
    ];

    const rows = [
      { id: "Daily", amount: this.getLocalizedNumber(yearlyInterest / 365) || 0, value: this.getCurrencySymbol() + (this.getLocalizedPrice(this.state.interestSimulation.simulatedPrice * (yearlyInterest / 365)) || 0)},
      { id: "Weekly", amount: this.getLocalizedNumber(yearlyInterest / 52) || 0, value: this.getCurrencySymbol() + (this.getLocalizedPrice(this.state.interestSimulation.simulatedPrice * (yearlyInterest / 52)) || 0)},
      { id: "Monthly", amount: this.getLocalizedNumber(yearlyInterest / 12) || 0, value: this.getCurrencySymbol() + (this.getLocalizedPrice(this.state.interestSimulation.simulatedPrice * (yearlyInterest / 12)) || 0)},
      { id: "Yearly", amount: this.getLocalizedNumber(yearlyInterest) || 0, value: this.getCurrencySymbol() + (this.getLocalizedPrice(this.state.interestSimulation.simulatedPrice * yearlyInterest) || 0)},
    ];

    return(
      <div className="col-xs-12 col-sm-6 col-lg-4 card-container">
        <Card className="card">
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
                <MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} />
              </div>
            </div>
          </div>
          <div className="back" style={{display: back}}>
            <div className="card-body p-0">
              <div className="row">
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
            </div>
              <h4 className="card-title settings-title">
                {this.props.asset.name + "(" + this.props.asset.symbol + ")"}
              </h4>

              <div className="card-text">
                <div className="mb-2">Price: {this.getCurrencySymbol() + this.getLocalizedPrice(price)}</div>

                <TextField
                  label="My Holdings"
                  onChange={
                    event => {
                      this.props.updateHoldings(event.target.value, this.props.asset.symbol);

                      this.setState({
                        simulatedValue: event.target.value * this.state.simulatedPrice
                      })
                    }
                  }
                  size={"small"}
                  value={this.getLocalizedNumber(this.props.asset.holdings)}
                  variant="outlined"
                />

                <MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} />
              </div>

              <hr />

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>Simulation</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="card-text">

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
                                  simulatedValue: ((((event.target.value * .01) * price) + price) * this.props.asset.holdings),
                                  simulatedCap: ((((event.target.value * .01) * price) + price) * this.props.asset.circulating_supply)
                              })
                        }
                        size={"small"}
                        value={this.getLocalizedPrice(this.state.simulatedPercentChange)}
                        variant="outlined"
                    />

                    <Slider
                        className="slider"
                        max={this.props.settings.sliderMax}
                        min={-100}
                        onChange={
                          (event, value) =>
                              this.setState({
                                  simulatedPercentChange: value,
                                  simulatedPrice: (((value * .01) * price) + price),
                                  simulatedValue: ((((value * .01) * price) + price) * this.props.asset.holdings),
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
                                  simulatedValue: (event.target.value * this.props.asset.holdings),
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
                                  simulatedPercentChange: (100 * (((event.target.value / this.props.asset.holdings) - price) / price)),
                                  simulatedPrice: (event.target.value / this.props.asset.holdings),
                                  simulatedValue: event.target.value,
                                  simulatedCap: ((event.target.value / this.props.asset.holdings) * this.props.asset.circulating_supply)
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
                                  simulatedValue: ((event.target.value / this.props.asset.circulating_supply) * this.props.asset.holdings),
                                  simulatedCap: event.target.value
                              })
                      }
                      size={"small"}
                      value={this.getLocalizedPrice(this.state.simulatedCap)}
                      variant="outlined"
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>Interest Calculator</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="card-text">
                    <div className="row">
                      <div className="col-6">
                        <TextField
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          label="Interest"
                          onChange={
                            event => {
                              this.setState({
                                interestSimulation: {
                                  ...this.state.interestSimulation,
                                  interest: event.target.value
                                }
                              });
                            }
                          }
                          size={"small"}
                          value={this.state.interestSimulation.interest}
                          variant="outlined"
                        />
                      </div>
                      <div className="col-6">
                        <TextField
                          label="Price"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">{this.getCurrencySymbol()}</InputAdornment>,
                          }}
                          onChange={
                            event => {
                              this.setState({
                                interestSimulation: {
                                  ...this.state.interestSimulation,
                                  simulatedPrice: event.target.value
                                }
                              })
                            }
                          }
                          size="small"
                          value={this.getLocalizedNumber(this.state.interestSimulation.simulatedPrice)}
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <DataGrid autoHeight disableColumnMenu disableColumnReorder rows={rows} columns={columns} hideFooter />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>Exit Planning</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <EditableTable currencySymbol={this.getCurrencySymbol()} rows={this.props.asset.exitPlan} setRows={this.props.updateExitPlan.bind(this)} symbol={this.props.asset.symbol} />
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default AssetCard;
