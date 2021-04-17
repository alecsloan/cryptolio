import Drawer from '@material-ui/core/Drawer'
import React, { Component } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import {
  Grid,
  IconButton,
  InputAdornment,
  Slider
} from '@material-ui/core'
import { ArrowBack, Delete } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField'
import ExitPlanningTable from './ExitPlanningTable'
import * as Util from '../Util/index'
import InterestCalculator from './InterestCalculator'
import Button from '@material-ui/core/Button'
import { MyBalance } from '../Util/index'

class AssetUtilities extends Component {
  UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
    let assetSymbol = null
    let simulatedPrice = 0
    let simulatedValue = 0
    let simulatedCap = 0

    if (nextProps.asset) {
      assetSymbol = nextProps.asset.symbol
      simulatedPrice = nextProps.asset.price
      simulatedValue = nextProps.asset.holdings * simulatedPrice
      simulatedCap = nextProps.asset.circulating_supply * simulatedPrice
    }

    this.setState({
      assetSymbol: assetSymbol,
      simulatedPercentChange: 0,
      simulatedPrice: simulatedPrice,
      simulatedValue: simulatedValue,
      simulatedCap: simulatedCap
    })
  }

  render () {
    if (!this.props.asset) {
      return null
    }

    const currency = this.props.settings.currency
    const settings = this.props.settings

    const price = this.props.asset.price

    return (
      <Drawer
        anchor='right'
        open={this.props.asset !== null}
        onClose={() => this.props.setAssetUtilityShown(null)}
      >
        <IconButton
          aria-label='close asset utility'
          className='back-arrow'
          color='inherit'
          onClick={() => this.props.setAssetUtilityShown(null)}
        >
          <ArrowBack />
        </IconButton>
        <h2 className='settings-title'>
          {this.props.asset.name} ({this.props.asset.symbol})
          <MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} />
        </h2>

        <hr />

        <div className='settings-panel'>
          <Grid container>
            <Grid item xs={12} md={6}>
              <TextField
                label='My Holdings'
                onChange={
                  event => {
                    this.props.updateHoldings(event.target.value, this.props.asset.symbol)
                  }
                }
                size='small'
                value={Util.getLocalizedNumber(this.props.asset.holdings, this.props.settings)}
                variant='outlined'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant='contained'
                className='mb-2'
                color='secondary'
                startIcon={<Delete />}
                onClick={() => {
                  this.props.removeCrypto(this.props.asset.symbol);
                  this.props.setAssetUtilityShown(null);
                }}
              >
                Remove Asset
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} md={6}>
              <h4>Simulation</h4>

              <TextField
                InputProps={{
                  endAdornment: <InputAdornment position='end'>%</InputAdornment>
                }}
                label='Simulated Percent'
                onChange={
                    event =>
                      this.setState({
                        simulatedPercentChange: event.target.value,
                        simulatedPrice: (((event.target.value * 0.01) * price) + price),
                        simulatedValue: ((((event.target.value * 0.01) * price) + price) * this.props.asset.holdings),
                        simulatedCap: ((((event.target.value * 0.01) * price) + price) * this.props.asset.circulating_supply)
                      })
                  }
                size='small'
                value={Util.getLocalizedNumber(this.state.simulatedPercentChange, settings)}
                variant='outlined'
              />

              <Slider
                className='slider'
                max={10000}
                min={-100}
                onChange={
                    (event, value) =>
                      this.setState({
                        simulatedPercentChange: value,
                        simulatedPrice: (((value * 0.01) * price) + price),
                        simulatedValue: ((((value * 0.01) * price) + price) * this.props.asset.holdings),
                        simulatedCap: ((((value * 0.01) * price) + price) * this.props.asset.circulating_supply)
                      })
                  }
                valueLabelFormat={
                    value => {
                      if (!value) { return '0%' }

                      return Util.getLocalizedPercent(value * 0.01)
                    }
                  }
                valueLabelDisplay='auto'
                value={this.state.simulatedPercentChange}
              />

              <TextField
                InputProps={{
                  startAdornment: <InputAdornment position='start'>{Util.getCurrencySymbol(currency)}</InputAdornment>
                }}
                label='Simulated Price'
                onChange={
                    event =>
                      this.setState({
                        simulatedPercentChange: (100 * ((event.target.value - price) / price)),
                        simulatedPrice: event.target.value,
                        simulatedValue: (event.target.value * this.props.asset.holdings),
                        simulatedCap: (event.target.value * this.props.asset.circulating_supply)
                      })
                  }
                size='small'
                value={Util.getLocalizedNumber(this.state.simulatedPrice, settings)}
                variant='outlined'
              />

              <TextField
                InputProps={{
                  startAdornment: <InputAdornment position='start'>{Util.getCurrencySymbol(currency)}</InputAdornment>
                }}
                label='Simulated Value'
                onChange={
                    event =>
                      this.setState({
                        simulatedPercentChange: (100 * (((event.target.value / this.props.asset.holdings) - price) / price)),
                        simulatedPrice: (event.target.value / this.props.asset.holdings),
                        simulatedValue: event.target.value,
                        simulatedCap: ((event.target.value / this.props.asset.holdings) * this.props.asset.circulating_supply)
                      })
                  }
                size='small'
                value={Util.getLocalizedNumber(this.state.simulatedValue, settings)}
                variant='outlined'
              />

              <TextField
                InputProps={{
                  startAdornment: <InputAdornment position='start'>{Util.getCurrencySymbol(currency)}</InputAdornment>
                }}
                label='Simulated Cap'
                onChange={
                    event =>
                      this.setState({
                        simulatedPercentChange: (100 * ((event.target.value - (this.props.asset.circulating_supply * price)) / (this.props.asset.circulating_supply * price))),
                        simulatedPrice: (event.target.value / this.props.asset.circulating_supply),
                        simulatedValue: ((event.target.value / this.props.asset.circulating_supply) * this.props.asset.holdings),
                        simulatedCap: event.target.value
                      })
                  }
                size='small'
                value={Util.getLocalizedNumber(this.state.simulatedCap, settings)}
                variant='outlined'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <h4>Interest Calculator</h4>

              <InterestCalculator asset={this.props.asset} price={this.state.simulatedPrice} settings={settings} updateInterest={this.props.updateInterest.bind(this)} />
            </Grid>

            <hr />

            <Grid item xs={12}>
              <h4>Exit Planning</h4>

              <ExitPlanningTable holdings={this.props.asset.holdings} rows={this.props.asset.exitPlan} settings={settings} setRows={this.props.updateExitPlan.bind(this)} symbol={this.props.asset.symbol} />
            </Grid>
          </Grid>
        </div>
      </Drawer>
    )
  }
}

export default AssetUtilities
