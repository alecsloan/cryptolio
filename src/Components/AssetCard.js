import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Card.css';
import TextField from "@material-ui/core/TextField";
import {Card, IconButton} from "@material-ui/core";
import {BarChart, Delete, Save, Settings as SettingsIcon} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import * as Util from "../Util/index";
import {Skeleton} from "@material-ui/lab";

function MyBalance(props) {
  if (props.holdings > 0 && props.settings.showCardBalances) {
    return(
      <div className="mt-2">
        My Balance: {Util.getLocalizedPrice(props.price * props.holdings, props.settings)}
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
    };
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

      let percent = <span>{Util.getLocalizedPercent(percentChange * .01)}</span>;

      return (
        percentChange ?
          <div>
            {period}
            <b className={hourColor + " ml-2"}>
              {percent}
            </b>
          </div>
        :
          <Skeleton className="m-auto" height={20} width={"50%"} />
      )
    }
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

    return(
      <div className="col-xs-12 col-sm-6 col-lg-4 card-container">
        <Card className="card">
          <div className={(window.innerWidth <= 760) ? "row" : ""} style={{display: front}} onClick={() => this.toggleSettings()}>
            <div className={(window.innerWidth <= 760) ? "ml-2 w-50" : ""}>
              <IconButton
                aria-label={this.props.asset.name + " settings"}
                className='settings pull-right'
                color="inherit"
                onClick={() => this.toggleSettings()}
              >
                <SettingsIcon />
              </IconButton>
              {
                this.props.asset.imageURL ?
                  <img
                    alt={this.props.asset.name + ' Logo'}
                    className="card-img-top center"
                    src={this.props.asset.imageURL}
                  />
                :
                  <Skeleton className="card-img-top m-auto" variant="circle" height={100} />
              }
            <h4 className="card-title">
              {
                (this.props.asset.name && this.props.asset.symbol) ?
                  `${this.props.asset.name} (${this.props.asset.symbol})`
                :
                  <Skeleton className="m-auto" height={28} width={"50%"} />
              }
            </h4>
            </div>
            <div className="card-body">
              <div className="card-text">
                { price ? <div>Price: {Util.getLocalizedPrice(price, this.props.settings)}</div> : <Skeleton className="m-auto" height={20} width={"50%"} />}
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
                <IconButton
                  aria-label={"remove " + this.props.asset.name}
                  className='settings pull-left visible'
                  color="inherit"
                  onClick={() => this.props.removeCrypto(this.props.asset.symbol)}
                >
                  <Delete />
                </IconButton>
                <IconButton
                  aria-label={"save " + this.props.asset.name}
                  className='settings pull-right visible'
                  color="inherit"
                  onClick={() => this.toggleSettings()}
                >
                  <Save />
                </IconButton>
            </div>
              <h4 className="card-title settings-title">
                <a className="text-white" href={this.props.asset.url} rel="noopener noreferrer" target="_blank">
                  {this.props.asset.name} ({this.props.asset.symbol})
                </a>
              </h4>

              <div className="card-text">
                <div className="mb-2">Price: {Util.getLocalizedPrice(price, this.props.settings)}</div>

                <TextField
                  label="My Holdings"
                  onChange={
                    event => {
                      this.props.updateHoldings(event.target.value, this.props.asset.symbol);
                    }
                  }
                  size={"small"}
                  value={Util.getLocalizedNumber(this.props.asset.holdings, this.props.settings)}
                  variant="outlined"
                />

                <MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} />
              </div>

              <hr />

              <Button
                variant="contained"
                className="mb-2"
                color="primary"
                startIcon={<BarChart />}
                onClick={() => this.props.setAssetUtilityShown(this.props.asset)}
              >
                Simulation and more
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default AssetCard;
