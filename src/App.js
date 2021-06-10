import Header from './Components/Header.js'
import Hotkeys from 'react-hot-keys'
import React, { Component } from 'react'
import Settings from './Components/Settings.js'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import './styles/App.css'
import { CssBaseline, IconButton, Snackbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { Alert } from '@material-ui/lab'
import AssetPanel from './Components/AssetPanel'
import * as CoinGecko from './Util/CoinGecko'
import * as CoinMarketCap from './Util/CoinMarketCap'
import * as Theme from './Theme'
import LayoutHandler from './Components/LayoutHandler'

class App extends Component {
  constructor (props) {
    super(props)

    const initialData = JSON.parse(window.localStorage.getItem('data')) || { assets: [{ cgId: "ethos", cmcId: 1817, symbol: 'VGX' }], availableAssets: [] }
    const initialSettings = JSON.parse(window.localStorage.getItem('settings')) || {
      addDropdownHideable: false,
      assetPanelShown: null,
      autoHideFetchNotification: 20000,
      balanceChangeTimeframe: 'percent_change_24h',
      currency: 'USD',
      datasource: 'coinmarketcap',
      decimals2: 100,
      decimals3: 1,
      decimals4: null,
      fetchInterval: 300000,
      portfolioBreakdown: "none",
      renderStyle: (window.innerWidth <= 500) ? 'table' : 'card:classic',
      renderSubStyle: 'table',
      show1hChange: true,
      show24hChange: true,
      show7dChange: true,
      showAssetBalances: true,
      showPortfolioBalance: true,
      sorting: 'balance',
      theme: Theme.dark
    }

    initialSettings.theme = createMuiTheme(initialSettings.theme) || Theme.dark

    this.state = {
      data: {
        assets: initialData.assets,
        availableAssets: initialData.availableAssets
      },
      dataUpdated: false,
      showSettings: false,
      settings: initialSettings,
      updatingData: false,
      timestamp: null
    }

    if (!this.state.data.availableAssets || this.state.data.availableAssets.length === 0) {
      this.fetchAvailableAssets()
    }
  }

  addCrypto (cgId, cmcId, symbol) {
    if (this.state.data.assets.find(asset => asset.symbol === symbol)) { return }

    const assets = this.state.data.assets

    assets.push({
      cgId: cgId,
      cmcId: cmcId,
      symbol: symbol
    })

    this.storeData(assets)

    this.fetchAssetData()
  }

  componentDidMount () {
    this.setFetchInterval()
    this.fetchAssetData()
  }

  editSetting (settingName, value) {
    if (!settingName) { return }

    if (settingName === 'currency' && !value) {
      value = 'USD'
    } else if (settingName === 'fetchInterval' && value < 60000) {
      value = 60000
    } else if (settingName === 'theme') {
      if (value === 'light') {
        value = Theme.dark
      } else {
        value = Theme.light
      }
    }

    const settings = this.state.settings

    settings[settingName] = value

    this.setState({
      settings: settings
    })

    if (settingName === 'currency' || settingName === 'datasource') {
      this.fetchAssetData()
    } else if (settingName === 'fetchInterval') {
      this.setFetchInterval()
    }

    window.localStorage.setItem('settings', JSON.stringify(settings))
  }

  async fetchAssetData (currency = this.state.settings.currency) {
    this.setState({
      updatingData: true
    })

    const assets = this.state.data.assets

    let data

    if (this.state.settings.datasource === 'coingecko') {
      if (assets) {
        let ids = assets.map(asset => asset.cgId)

        data = await CoinGecko.getAssetData(currency, ids, assets)
      }
    } else {
      let symbols = null

      if (assets) {
        symbols = assets.map(asset => asset.symbol)
      }

      data = await CoinMarketCap.getAssetData(currency, symbols, assets)
    }

    if (data && data.assets) {
      this.storeData(data.assets)

      this.setState({
        dataUpdated: true,
        timestamp: data.timestamp,
        updatingData: false
      })
    }
  }

  async fetchAvailableAssets () {
    const coinmarketcap = await CoinMarketCap.getAvailableAssets()

    const coingecko = await CoinGecko.getAvailableAssets()

    const assets =
      coinmarketcap.map(asset => ({
        ...coingecko.find((asset1) => !asset1.cgId.includes("binance-peg") && (asset1.symbol === asset.symbol.toLowerCase() && asset1.circulating_supply === asset.circulating_supply)),
        ...asset
      }))

    assets.sort((a, b) => a.rank - b.rank)

    this.setState({
      data: {
        ...this.state.data,
        availableAssets: assets
      }
    })

    this.fetchAssetData()
  }

  removeCrypto (symbols) {
    let assets = this.state.data.assets

    if (!Array.isArray(symbols)) {
      symbols = [symbols]
    }

    symbols.forEach((symbol) => {
      const assetIndex = assets.findIndex(asset => asset.symbol === symbol.toUpperCase())

      assets.splice(assetIndex, 1)
    })

    this.storeData(assets)
  }

  setAssetPanelShown (asset) {
    this.setState({
      assetPanelShown: asset
    })
  }

  setFetchInterval () {
    setInterval(async () => {
      this.fetchAssetData()
    }, this.state.settings.fetchInterval || 300000)
  }

  async storeData (assets) {
    let assetPanelShown = this.state.assetPanelShown

    if (assetPanelShown) {
      assetPanelShown = assets.find(asset => asset.symbol === this.state.assetPanelShown.symbol)
    }

    this.setState({
      data: {
        ...this.state.data,
        assets: assets
      },
      assetPanelShown: assetPanelShown
    })

    window.localStorage.setItem('data', JSON.stringify(this.state.data))
  }

  toggleShowSettings () {
    this.setState({
      showSettings: !this.state.showSettings
    })
  }

  updateHoldings (value, symbol) {
    const assets = this.state.data.assets

    assets.find(asset => asset.symbol === symbol).holdings = value

    this.storeData(assets)
  }

  uploadData (file) {
    const reader = new window.FileReader()

    reader.readAsText(file)

    reader.addEventListener('load', (event) => {
      const result = event.target.result

      const data = JSON.parse(result)

      if (data.assets) {
        this.storeData(data.assets)
      }
    })
  }

  updateExitPlan (rows, symbol) {
    const assets = this.state.data.assets

    assets.find(asset => asset.symbol === symbol).exitPlan = rows

    this.storeData(assets)
  }

  updateInterest (interest, symbol) {
    const assets = this.state.data.assets

    assets.find(asset => asset.symbol === symbol).interest = interest

    this.storeData(assets)
  }

  render () {
    return (
      <div className='page'>
        <ThemeProvider theme={this.state.settings.theme}>
          <CssBaseline />

          <Header addCrypto={this.addCrypto.bind(this)} assets={this.state.data.assets} availableAssets={this.state.data.availableAssets} editSetting={this.editSetting.bind(this)} refreshData={this.fetchAssetData.bind(this)} settings={this.state.settings} toggleShowSettings={this.toggleShowSettings.bind(this)} updatingData={this.state.updatingData || false} />
          <hr hidden={window.innerWidth <= 500} />
          <LayoutHandler assets={this.state.data.assets} editSetting={this.editSetting.bind(this)} settings={this.state.settings} setAssetPanelShown={this.setAssetPanelShown.bind(this)} />
          <Settings data={this.state.data} editSetting={this.editSetting.bind(this)} settings={this.state.settings} showSettings={this.state.showSettings} theme={this.state.settings.theme} toggleShowSettings={this.toggleShowSettings.bind(this)} uploadData={this.uploadData.bind(this)} />
          <AssetPanel asset={this.state.assetPanelShown} editSetting={this.editSetting.bind(this)} settings={this.state.settings} removeCrypto={this.removeCrypto.bind(this)} setAssetPanelShown={this.setAssetPanelShown.bind(this)} updateExitPlan={this.updateExitPlan.bind(this)} updateHoldings={this.updateHoldings.bind(this)} updateInterest={this.updateInterest.bind(this)} />
          <Hotkeys
            keyName='shift+/'
            onKeyDown={this.toggleShowSettings.bind(this)}
          />
          <Snackbar
            action={
              <>
                <IconButton
                  aria-label='close'
                  color='inherit'
                  onClick={() => this.setState({ dataUpdated: false })}
                >
                  <CloseIcon />
                </IconButton>
              </>
              }
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            autoHideDuration={Number(this.state.settings.autoHideFetchNotification)}
            onClose={() => this.setState({ dataUpdated: false })}
            open={this.state.dataUpdated}
          >
            <Alert onClose={() => this.setState({ dataUpdated: false })} severity='success'>
              Prices updated: {new Date(this.state.timestamp).toLocaleString()}
            </Alert>
          </Snackbar>
        </ThemeProvider>
      </div>
    )
  }
}

export default App
