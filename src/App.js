import AssetCard from './Components/AssetCard.js'
import Header from './Components/Header.js'
import Hotkeys from 'react-hot-keys'
import React, { Component } from 'react'
import Settings from './Components/Settings.js'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import './styles/App.css'
import { colors, CssBaseline, IconButton, Snackbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { Alert } from '@material-ui/lab'
import AssetUtilities from './Components/AssetUtilities'
import * as CoinGecko from './Util/CoinGecko'
import * as CoinMarketCap from './Util/CoinMarketCap'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#1c2025',
      paper: colors.grey[800]
    },
    primary: {
      main: colors.grey[900]
    }
  }
})

const lightTheme = createMuiTheme({
  palette: {
    type: 'light'
  }
})

function CardRow (props) {
  const cards = []

  let assets = props.assets

  if (!assets) { return null }

  if (props.settings.sorting === 'price') {
    assets = assets.sort((a, b) => b.price - a.price)
  } else if (props.settings.sorting === 'marketcap') {
    assets = assets.sort((a, b) => b.market_cap - a.market_cap)
  } else if (props.settings.sorting === '1h') {
    assets = assets.sort((a, b) => b.percent_change_1h - a.percent_change_1h)
  } else if (props.settings.sorting === '24h') {
    assets = assets.sort((a, b) => b.percent_change_24h - a.percent_change_24h)
  } else if (props.settings.sorting === '7d') {
    assets = assets.sort((a, b) => b.percent_change_7d - a.percent_change_7d)
  } else {
    assets = assets.sort((a, b) => ((b.holdings || 0.000001) * b.price) - ((a.holdings || 0.000001) * a.price))
  }

  assets.forEach(asset => {
    cards.push(<AssetCard asset={asset} key={asset.symbol} removeCrypto={props.removeCrypto.bind(this)} settings={props.settings} setAssetUtilityShown={props.setAssetUtilityShown.bind(this)} updateHoldings={props.updateHoldings.bind(this)} />)
  })

  return <div className='cardRow'>{cards}</div>
}

class App extends Component {
  constructor (props) {
    super(props)

    const initialData = JSON.parse(window.localStorage.getItem('data')) || { assets: [{ cmcId: 1817, symbol: 'VGX' }], availableAssets: [] }
    const initialSettings = JSON.parse(window.localStorage.getItem('settings')) || {
      addDropdownHideable: false,
      assetUtilityShown: null,
      autoHideFetchNotification: 20000,
      currency: 'USD',
      datasource: 'coinmarketcap',
      decimals2: 100,
      decimals3: 1,
      decimals4: null,
      fetchInterval: 300000,
      show1hChange: true,
      show24hChange: true,
      show7dChange: true,
      showCardBalances: true,
      showPortfolioBalance: true,
      sliderMax: 10000,
      sorting: 'balance',
      theme: lightTheme
    }

    initialSettings.theme = createMuiTheme(initialSettings.theme)

    this.state = {
      data: {
        assets: initialData.assets,
        availableAssets: initialData.availableAssets
      },
      dataUpdated: false,
      showSettings: false,
      settings: initialSettings,
      timestamp: null
    }

    if (!this.state.data.availableAssets || this.state.data.availableAssets.length === 0) {
      this.fetchAvailableAssets()
    }
  }

  addCrypto (cmcId, symbol) {
    if (this.state.data.assets.find(asset => asset.symbol === symbol)) { return }

    const assets = this.state.data.assets

    assets.push({
      cmcId: cmcId,
      symbol: symbol
    })

    this.storeData(assets)

    this.fetchAssetData()
  }

  componentDidMount () {
    this.setFetchInterval()
  }

  editSetting (settingName, value) {
    if (!settingName) { return }

    if (settingName === 'currency' && !value) {
      value = 'USD'
    } else if (settingName === 'fetchInterval' && value < 6000) {
      value = 6000
    } else if (settingName === 'theme') {
      if (value === 'light') {
        value = darkTheme
      } else {
        value = lightTheme
      }
    }

    const settings = this.state.settings

    settings[settingName] = value

    this.setState({
      settings: settings
    })

    if (settingName === 'currency' || settingName === 'datasource') {
      this.fetchAssetData()
    }

    window.localStorage.setItem('settings', JSON.stringify(settings))
  }

  async fetchAssetData (currency = this.state.settings.currency) {
    const assets = this.state.data.assets
    let symbols = null

    if (assets) {
      symbols = assets.map(asset => asset.symbol.toLowerCase())
    }

    let data

    if (this.state.settings.datasource === 'coingecko') {
      data = await CoinGecko.getAssetData(currency, symbols, assets)
    } else {
      data = await CoinMarketCap.getAssetData(currency, symbols, assets)
    }

    this.storeData(data.assets)

    this.setState({
      dataUpdated: true,
      timestamp: data.timestamp
    })
  }

  async fetchAvailableAssets () {
    const coinmarketcap = await CoinMarketCap.getAvailableAssets()

    const coingecko = await CoinGecko.getAvailableAssets()

    const assets =
      coinmarketcap.map(asset => ({
        ...coingecko.find((asset1) => (asset1.symbol === asset.symbol) && asset1),
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

  removeCrypto (symbol) {
    const assetIndex = this.state.data.assets.findIndex(asset => asset.symbol === symbol.toUpperCase())

    this.state.data.assets.splice(assetIndex, 1)

    this.storeData(this.state.data.assets)
  }

  setAssetUtilityShown (asset) {
    this.setState({
      assetUtilityShown: asset
    })
  }

  setFetchInterval () {
    setInterval(async () => {
      this.fetchAssetData()
    }, this.state.settings.fetchInterval || 300000)
  }

  async storeData (assets) {
    this.setState({
      data: {
        ...this.state.data,
        assets: assets
      }
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
        <ThemeProvider theme={this.state.settings.theme || lightTheme}>
          <CssBaseline />

          <Header addCrypto={this.addCrypto.bind(this)} assets={this.state.data.assets} availableAssets={this.state.data.availableAssets} editSetting={this.editSetting.bind(this)} refreshData={this.fetchAssetData.bind(this)} settings={this.state.settings} toggleShowSettings={this.toggleShowSettings.bind(this)} />
          <hr />
          <div className='content'>
            <CardRow assets={this.state.data.assets} removeCrypto={this.removeCrypto.bind(this)} settings={this.state.settings} setAssetUtilityShown={this.setAssetUtilityShown.bind(this)} updateHoldings={this.updateHoldings.bind(this)} />
          </div>
          <Settings data={this.state.data} editSetting={this.editSetting.bind(this)} settings={this.state.settings} showSettings={this.state.showSettings} theme={this.state.settings.theme || lightTheme} toggleShowSettings={this.toggleShowSettings.bind(this)} uploadData={this.uploadData.bind(this)} />
          <AssetUtilities asset={this.state.assetUtilityShown} settings={this.state.settings} setAssetUtilityShown={this.setAssetUtilityShown.bind(this)} updateExitPlan={this.updateExitPlan.bind(this)} updateInterest={this.updateInterest.bind(this)} />
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
