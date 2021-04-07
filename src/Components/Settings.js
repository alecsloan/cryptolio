import Autocomplete from '@material-ui/lab/Autocomplete'
import Button from '@material-ui/core/Button'
import CloudDownloadIcon from '@material-ui/icons/CloudDownloadOutlined'
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined'
import Drawer from '@material-ui/core/Drawer'
import exportFromJSON from 'export-from-json'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import React, { Component } from 'react'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '../styles/Settings.css'
import IntervalSelector from './IntervalSelector'
import { Grid, IconButton } from '@material-ui/core'
import { ArrowBack, GitHub } from '@material-ui/icons'
import * as CoinGecko from '../Util/CoinGecko'
import * as CoinMarketCap from '../Util/CoinMarketCap'

class Settings extends Component {
  constructor (props) {
    super(props)

    const currencies = require('../currencies.json')

    this.state = {
      currencies: currencies,
      currency: currencies.find(currency => currency.code === this.props.settings.currency)
    }
  }

  updateCurrency (currencyCode) {
    this.setState({
      currency: this.state.currencies.find(currency => currency.code === currencyCode)
    })
  }

  render () {
    return (
      <Drawer
        anchor='right'
        open={this.props.showSettings}
        onClose={() => this.props.toggleShowSettings()}
      >
        <IconButton
          aria-label='close settings'
          className='back-arrow'
          color='inherit'
          onClick={() => this.props.toggleShowSettings()}
        >
          <ArrowBack />
        </IconButton>
        <h2 className='settings-title'>Settings</h2>
        <div className='settings-panel'>
          <Grid className='mb-5' container>
            <Grid item xs={12} lg={6}>
              <FormControlLabel
                control={
                  <Select
                    className='w-100'
                    onChange={event => this.props.editSetting('datasource', event.target.value)}
                    value={this.props.settings.datasource}
                    variant='outlined'
                  >
                    <MenuItem value='coingecko'><img alt='CoinGecko' src={(this.props.theme.palette.type === 'dark') ? CoinGecko.logoWhite : CoinGecko.logo} /></MenuItem>
                    <MenuItem value='coinmarketcap'><img alt='CoinMarketCap' src={(this.props.theme.palette.type === 'dark') ? CoinMarketCap.logoWhite : CoinMarketCap.logo} /></MenuItem>
                  </Select>
                          }
                label='Datasource'
                labelPlacement='top'
                value='top'
              />
            </Grid>
            <Grid className='m-auto' item xs={6} lg={3}>
              <input
                accept='application/json'
                className='d-none'
                id='upload'
                onInputCapture={event => this.props.uploadData(event.target.files[0])}
                type='file'
              />
              <label htmlFor='upload'>
                <Button
                  variant='contained'
                  color='primary'
                  component='span'
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Data
                </Button>
              </label>
            </Grid>
            <Grid className='m-auto' item xs={6} lg={3}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<CloudDownloadIcon />}
                onClick={() => exportFromJSON({ data: this.props.data, fileName: 'cryptolio_data', exportType: 'json' })}
              >
                Download Data
              </Button>
            </Grid>
          </Grid>
          <Grid className='mb-5' container>
            <Grid item xs={12}>
              <h4 className='text-center mb-4'>Asset Display Settings</h4>
            </Grid>
            <Grid className='m-auto' item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    defaultChecked={this.props.settings.show1hChange}
                    onChange={() => this.props.editSetting('show1hChange', !this.props.settings.show1hChange)}
                  />
                          }
                label='Show 1h Change'
                labelPlacement='top'
                value='top'
              />
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    defaultChecked={this.props.settings.show24hChange}
                    onChange={() => this.props.editSetting('show24hChange', !this.props.settings.show24hChange)}
                  />
                          }
                label='Show 24 Change'
                labelPlacement='top'
                value='top'
              />
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    defaultChecked={this.props.settings.show7dChange}
                    onChange={() => this.props.editSetting('show7dChange', !this.props.settings.show7dChange)}
                  />
                          }
                label='Show 7d Change'
                labelPlacement='top'
                value='top'
              />
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    defaultChecked={this.props.settings.showCardBalances}
                    onChange={() => this.props.editSetting('showCardBalances', !this.props.settings.showCardBalances)}
                  />
                }
                label='Show Asset Balance'
                labelPlacement='top'
                value='top'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                className='m-0 w-100'
                control={
                  <Select
                    className='w-100'
                    onChange={event => this.props.editSetting('renderStyle', event.target.value)}
                    value={this.props.settings.renderStyle}
                    variant='outlined'
                  >
                    <MenuItem key='card-classic' value='card:classic'>Classic Card</MenuItem>
                    <MenuItem key='card-compact' value='card:compact'>Compact Card</MenuItem>
                    <MenuItem key='table' value='table'>Table</MenuItem>
                  </Select>
                }
                label='Asset Display Style'
                labelPlacement='top'
                value='top'
              />
              <FormControlLabel
                className='m-0 w-100'
                control={
                  <Select
                    className='w-100'
                    onChange={event => this.props.editSetting('sorting', event.target.value)}
                    value={this.props.settings.sorting}
                    variant='outlined'
                  >
                    <MenuItem key='balance' value='balance'>Balance</MenuItem>
                    <MenuItem key='marketcap' value='marketcap'>Marketcap</MenuItem>
                    <MenuItem key='price' value='price'>Price</MenuItem>
                    <MenuItem key='1h' value='1h'>1 Hour Change</MenuItem>
                    <MenuItem key='24h' value='24h'>24 Hour Change</MenuItem>
                    <MenuItem key='7d' value='7d'>7 Day Change</MenuItem>
                  </Select>
                }
                label='Sort By'
                labelPlacement='top'
                value='top'
              />
              <FormControlLabel
                className='m-0 w-100'
                control={
                  <TextField
                    className='w-100'
                    InputLabelProps={{
                      shrink: true
                    }}
                    onInputCapture={event => this.props.editSetting('sliderMax', (event.target.value < 100) ? 100 : event.target.value)}
                    size='small'
                    type='number'
                    value={this.props.settings.sliderMax}
                    variant='outlined'
                  />
                }
                label='Simulated Percent Slider Max'
                labelPlacement='top'
                value='top'
              />
            </Grid>
          </Grid>
          <Grid className='mb-4' container>
            <Grid item xs={12}>
              <h4 className='text-center mb-4'>General Settings</h4>
            </Grid>
            <Grid className='m-auto' item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    defaultChecked={this.props.settings.addDropdownHideable}
                    onChange={() => this.props.editSetting('addDropdownHideable', !this.props.settings.addDropdownHideable)}
                  />
                        }
                label='Add Dropdown Collapsable'
                labelPlacement='top'
                value='top'
              />
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    defaultChecked={this.props.settings.showPortfolioBalance}
                    onChange={() => this.props.editSetting('showPortfolioBalance', !this.props.settings.showPortfolioBalance)}
                  />
                }
                label='Show Portfolio Balance'
                labelPlacement='top'
                value='top'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                className='m-0 w-100'
                control={
                  <Autocomplete
                    autoComplete={false}
                    autoHighlight
                    className='w-100'
                    clearOnBlur
                    getOptionLabel={(option) => `${option.currency} (${option.symbol})`}
                    id='currency'
                    onChange={
                      (event, currency) => {
                        if (currency) {
                          this.updateCurrency(currency.code)
                          this.props.editSetting('currency', currency.code)
                        }
                      }
                    }
                    options={this.state.currencies}
                    renderInput={(params) => <TextField {...params} variant='outlined' />}
                    size='small'
                    value={this.state.currency}
                  />
                }
                label='Currency'
                labelPlacement='top'
                value='top'
              />
            </Grid>
          </Grid>
          <Grid className='mb-4' container>
            <Grid item xs={12} md={6}>
              <IntervalSelector
                value={this.props.settings.fetchInterval || 300000}
                label='Data Fetch Interval'
                labelPlacement='top'
                max='Hour'
                min='Minute'
                onChange={value => this.props.editSetting('fetchInterval', value)}
                selectFieldClasses='col-8'
                size='small'
                textFieldClasses='col-4'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <IntervalSelector
                value={this.props.settings.autoHideFetchNotification}
                label='Data Fetch Notification Timeout'
                labelPlacement='top'
                max='Minute'
                min='Second'
                onChange={value => this.props.editSetting('autoHideFetchNotification', value)}
                selectFieldClasses='col-8'
                size='small'
                textFieldClasses='col-4'
                variant='outlined'
              />
            </Grid>
          </Grid>
          <Grid className='mb-4' container>
            <Grid item xs={12} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                label='Show 2 Decimals When Price Under'
                onInputCapture={event => this.props.editSetting('decimals2', event.target.value)}
                size='small'
                type='number'
                value={this.props.settings.decimals2}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                label='Show 3 Decimals When Price Under'
                onInputCapture={event => this.props.editSetting('decimals3', event.target.value)}
                size='small'
                type='number'
                value={this.props.settings.decimals3 || ''}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                label='Show 4 Decimals When Price Under'
                onInputCapture={event => this.props.editSetting('decimals4', event.target.value)}
                size='small'
                type='number'
                value={this.props.settings.decimals4 || ''}
                variant='outlined'
              />
            </Grid>
          </Grid>

          <div>
            <h6>{`Assets Available: ${(this.props.data.availableAssets || 0).length}`}</h6>
            Version: {process.env.REACT_APP_VERSION} |
            <a className='ml-2 mr-2 text-white' href='https://github.com/alecsloan/cryptolio' rel='noopener noreferrer' target='_blank'>
              <IconButton
                aria-label='github repo'
                color='inherit'
              >
                <GitHub />
              </IconButton>
            </a> |
            Caveat Emptor
          </div>
        </div>
      </Drawer>
    )
  }
}

export default Settings
