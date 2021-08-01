import Hotkeys from 'react-hot-keys'
import React, { Component } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '../styles/Header.css'
import IconButton from '@material-ui/core/IconButton'
import {
  ArrowDownward,
  ArrowUpward,
  Brightness2,
  Brightness7,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Refresh,
  Settings as SettingsIcon
} from '@material-ui/icons'
import VirtualizedCryptoassetAutocomplete from './VirtualizedCryptoassetAutocomplete'
import { Box, CircularProgress, colors, Grid } from '@material-ui/core'
import * as Util from '../Util'
import abbreviate from 'number-abbreviate'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      displayAddSection: false,
      cryptoassetRef: null
    }
  }

  focusAddCryptoasset () {
    this.setState({
      displayAddSection: true
    })

    setTimeout(() => {
      document.getElementById('cryptoassets').focus()
    }, 50)
  }

  getPortfolioBalance () {
    if (!this.props.settings.showPortfolioBalance || !this.props.assets) { return }

    let balance = 0
    let change = 0

    this.props.assets.forEach((asset) => {
      if (asset.holdings > 0 && asset.price) {
        let assetBalance = asset.price * asset.holdings

        balance += asset.price * asset.holdings
        change += assetBalance * (asset[this.props.settings.balanceChangeTimeframe || 'percent_change_24h'] * .01)
      }
    })

    return <div className="d-inline-block">
      <Box className="d-inline-block m-0 align-middle" component={'h5'} color={change < 0 ? colors.red[300] : colors.green[300]}>
        {Util.getLocalizedPrice(balance, this.props.settings)}
      </Box>
      {
        (change)
        ? <Box className="d-inline-block pl-2" component={'small'} color={change < 0 ? colors.red[300] : colors.green[300]}>
          {
            (change < 0)
              ? <ArrowDownward/>
              : <ArrowUpward/>
          }
          <span className="align-middle">
            {Util.getCurrencySymbol(this.props.settings.currency) + abbreviate(change.toFixed(2), 2, ['K', 'M', 'B', 'T'])}
          </span>
        </Box>
        : null
      }
    </div>
  }

  toggleAddSection () {
    this.setState({ displayAddSection: !this.state.displayAddSection })
  }

  render () {
    let displayAddSection = 'none'
    let addIconClass = 'add-section-icon p-1'
    let addIconTitle = 'Show cryptoasset selector'

    if (!this.props.settings.addDropdownHideable) {
      addIconClass += ' d-none'
      displayAddSection = 'block'
    } else if (this.state.displayAddSection) {
      displayAddSection = 'block'
      addIconClass += ' rotate'
      addIconTitle = 'Hide cryptoasset selector'
    }

    return (
      <div className='header'>
        <div className='col-12'>
          <Grid className='mt-3' container>
            <Grid item xs={3}>
              <IconButton
                aria-label='mode'
                className='p-1 pull-left'
                color='inherit'
                onClick={() => this.props.refreshData()}
                title='Refresh Asset Data'
              >
                {
                  (this.props.updatingData)
                  ? <CircularProgress color='secondary' style={{ height: 24, margin: 5, width: 24}} />
                  : <Refresh/>
                }
              </IconButton>
              <IconButton
                className={addIconClass}
                color='inherit'
                aria-label='mode'
                onClick={() => this.toggleAddSection()}
                title={addIconTitle}
              >
                {displayAddSection ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <h2>Cryptolio</h2>
            </Grid>
            <Grid item xs={3}>
              <IconButton
                color='inherit'
                className='p-1 pull-right'
                aria-label='mode'
                onClick={() => this.props.toggleShowSettings()}
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                color='inherit'
                className='p-1 pull-right'
                aria-label='mode'
                onClick={() => this.props.editSetting('theme', this.props.settings.theme.palette.type)}
              >
                {this.props.settings.theme.palette.type === 'dark' ? <Brightness7 /> : <Brightness2 />}
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <div className='col-12'>
          {this.getPortfolioBalance()}
        </div>
        <div className='col-12' style={{ display: displayAddSection }}>
          <VirtualizedCryptoassetAutocomplete
            addCrypto={this.props.addCrypto.bind(this)}
            options={this.props.availableAssets}
          />
        </div>
        <Hotkeys
          keyName='/'
          onKeyDown={this.focusAddCryptoasset.bind(this)}
        />
      </div>
    )
  }
}

export default Header
