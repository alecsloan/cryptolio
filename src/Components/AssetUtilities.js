import Drawer from '@material-ui/core/Drawer';
import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {
  Grid,
  IconButton,
  InputAdornment,
  Slider,
} from "@material-ui/core";
import {ArrowBack} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {DataGrid} from "@material-ui/data-grid";
import EditableTable from "./EditableTable";
import * as Util from "../Util/index";

class AssetUtilities extends Component {
  componentWillReceiveProps(nextProps, nextContext) {
    var assetSymbol = null;
    var simulatedPrice = 0;
    var simulatedValue = 0;
    var simulatedCap = 0;

    if (nextProps.asset) {
      assetSymbol = nextProps.asset.symbol;
      simulatedPrice = nextProps.asset.price;
      simulatedValue = nextProps.asset.holdings * simulatedPrice;
      simulatedCap = nextProps.asset.circulating_supply * simulatedPrice;
    }

    this.setState({
      assetSymbol: assetSymbol,
      simulatedPercentChange: 0,
      simulatedPrice: simulatedPrice,
      simulatedValue: simulatedValue,
      simulatedCap: simulatedCap,
      interestSimulation: {
        interest: 0
      }
    });
  }

  render() {
    if (!this.props.asset) {
      return null;
    }

    var currency = this.props.settings.currency;
    var settings = this.props.settings;

    var price = this.props.asset.price;

    var yearlyInterest = this.props.asset.holdings * (this.state.interestSimulation.interest * .01);

    const columns = [
      { field: 'id', headerName: this.props.asset.symbol + " Earned", width: "33%", sortable: false },
      { field: 'amount', headerName: 'Amount', width: "33%", sortable: false },
      { field: 'value', headerName: Util.getCurrencySymbol(currency) + " Value", width: "33%", sortable: false },
    ];

    const rows = [
      { id: "Daily", amount: Util.getLocalizedNumber(yearlyInterest / 365, settings) || 0, value: Util.getLocalizedPrice(this.state.simulatedPrice * (yearlyInterest / 365) || 0, settings)},
      { id: "Weekly", amount: Util.getLocalizedNumber(yearlyInterest / 52, settings) || 0, value: Util.getLocalizedPrice(this.state.simulatedPrice * (yearlyInterest / 52) || 0, settings)},
      { id: "Monthly", amount: Util.getLocalizedNumber(yearlyInterest / 12, settings) || 0, value: Util.getLocalizedPrice(this.state.simulatedPrice * (yearlyInterest / 12) || 0, settings)},
      { id: "Yearly", amount: Util.getLocalizedNumber(yearlyInterest, settings) || 0, value: Util.getLocalizedPrice(this.state.simulatedPrice * yearlyInterest || 0, settings)},
    ];

    return (
      <Drawer
          anchor="right"
          open={this.props.asset !== null}
          onClose={() => this.props.setAssetUtilityShown(null)}
      >
          <IconButton
            aria-label={"close asset utility"}
            className="back-arrow"
            color="inherit"
            onClick={() => this.props.setAssetUtilityShown(null)}
          >
              <ArrowBack />
          </IconButton>
          <h2 className="settings-title">{this.props.asset.name} ({this.props.asset.symbol})</h2>
          <div className="settings-panel">
            <Grid container>
              <Grid item xs={12} md={6}>
                <h4>Simulation</h4>

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
                  value={Util.getLocalizedNumber(this.state.simulatedPercentChange, settings)}
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

                      return Util.getLocalizedPercent(value * .01);
                    }
                  }
                  valueLabelDisplay="auto"
                  value={this.state.simulatedPercentChange}
                />

                <TextField
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{Util.getCurrencySymbol(currency)}</InputAdornment>,
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
                  value={Util.getLocalizedNumber(this.state.simulatedPrice, settings)}
                  variant="outlined"
                />

                <TextField
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{Util.getCurrencySymbol(currency)}</InputAdornment>,
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
                  value={Util.getLocalizedNumber(this.state.simulatedValue, settings)}
                  variant="outlined"
                />

                <TextField
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{Util.getCurrencySymbol(currency)}</InputAdornment>,
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
                  value={Util.getLocalizedNumber(this.state.simulatedCap, settings)}
                  variant="outlined"
                />
            </Grid>

              <Grid item xs={12} md={6}>
                <h4>Interest Calculator</h4>


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

                <DataGrid autoHeight className="m-auto" columns={columns} disableColumnMenu disableColumnReorder hideFooter rows={rows} />
              </Grid>

              <hr />

              <Grid item xs={12}>
                <h4>Exit Planning</h4>

                <EditableTable holdings={this.props.asset.holdings} rows={this.props.asset.exitPlan} settings={settings} setRows={this.props.updateExitPlan.bind(this)} symbol={this.props.asset.symbol} />
              </Grid>
            </Grid>
          </div>
      </Drawer>
    );
  }
}

export default AssetUtilities;
