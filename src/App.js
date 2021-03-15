import AssetCard from './Components/AssetCard.js';
import Header from './Components/Header.js';
import Hotkeys from 'react-hot-keys';
import React, { Component } from 'react';
import Settings from './Components/Settings.js';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './styles/App.css';
import {colors, CssBaseline, IconButton, Snackbar} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const CORS_PROXY = 'https://cors.bridged.cc/'

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#1c2025",
      paper: colors.grey[800]
    },
    primary: {
      main: colors.grey[900]
    }
  }
});

const lightTheme = createMuiTheme({
  palette: {
    type: "light"
  }
});

function CardRow(props) {
  var cards = [];

  if (!props.assets)
    return <div></div>;

  props.assets.forEach(asset => {
    cards.push(<AssetCard asset={asset} key={asset.symbol} removeCrypto={props.removeCrypto.bind(this)} settings={props.settings} updateHoldings={props.updateHoldings.bind(this)}/>)
  });

  return <div className="cardRow">{cards}</div>;
}

class App extends Component {
  constructor(props){
    super(props);

    var initialData = JSON.parse(localStorage.getItem("data")) || {assets: [], cryptoassets: []};
    var initialSettings = JSON.parse(localStorage.getItem("settings")) || {
      addDropdownHideable: false,
      autoHideFetchNotification: 20000,
      currency: "USD",
      datasource: "coinmarketcap",
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
      theme: lightTheme
    };

    initialSettings.theme = createMuiTheme(initialSettings.theme);

    this.state ={
      cards: [],
      data: {
        assets: initialData.assets,
        cryptoassets: initialData.cryptoassets,
      },
      dataUpdated: false,
      showSettings: false,
      settings: initialSettings,
      timestamp: null
    };

    this.fetchAvailableAssets();

    if (!initialData.assets || initialData.assets.length === 0)
      this.addCrypto(1817, "ethos", "VGX");

    this.fetchAssetData();
  }

  addCrypto(cmc_id, symbol){
    if (!this.state.data.assets || this.state.data.assets.find(asset => asset.symbol === symbol))
      return;

    var assets = this.state.data.assets;

    assets.push({
      cmc_id: cmc_id,
      symbol: symbol
    });

    this.storeData(assets)

    this.fetchAssetData();
  }

  componentDidMount() {
    this.setFetchInterval();
  }

  editSetting(settingName, value) {
    if (!settingName)
      return;

    if (settingName === "currency" && !value) {
      value = "USD";
    }
    else if (settingName === "fetchInterval" && value < 6000) {
      value = 60000;
    }
    else if (settingName === "theme") {
      if (value === "light") {
        value = darkTheme;
      }
      else {
        value = lightTheme;
      }
    }

    var settings = this.state.settings;

    settings[settingName] = value;

    this.setState({
      settings: settings
    });

    if (settingName === "currency" || settingName === "datasource") {
      this.fetchAssetData();
    }

    localStorage.setItem("settings", JSON.stringify(settings));
  }

  getCoinGeckoData(currency) {
    var shownAssetSymbols;

    if (this.state.data.assets !== undefined)
      shownAssetSymbols = this.state.data.assets.map(asset => asset.symbol);

    try {
      fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&symbols=${shownAssetSymbols}&price_change_percentage=1h%2C24h%2C7d`)
          .then(res => res.json())
          .then(response => {

            if (!response)
              return;

            var assets = [];

            Object.entries(response).forEach(responseAsset => {
              responseAsset = responseAsset[1];

              var holdings = 0;
              var cmc_id = null;

              if (this.state.data.assets !== undefined) {
                var existingAsset = this.state.data.assets.find(asset => asset.symbol === responseAsset.symbol.toUpperCase());

                if (existingAsset) {
                  cmc_id = existingAsset.cmc_id;
                  holdings = existingAsset.holdings;
                }
              }

              assets.push({
                circulating_supply: responseAsset.circulating_supply,
                cmc_id: cmc_id,
                holdings: holdings,
                imageURL: responseAsset.image,
                market_cap: responseAsset.market_cap,
                max_supply: responseAsset.total_supply,
                name: responseAsset.name,
                percent_change_1h: responseAsset.price_change_percentage_1h_in_currency,
                percent_change_24h: responseAsset.price_change_percentage_24h_in_currency,
                percent_change_7d: responseAsset.price_change_percentage_7d_in_currency,
                price: responseAsset.current_price,
                symbol: responseAsset.symbol.toUpperCase(),
                volume_24h: responseAsset.total_volume
              });
            });

            this.storeData(assets);
          });
    }
    catch(e){
      console.log("Error getting CoinGecko data:", e)
    }
  }

  getCoinMarketCapData(currency) {
    var shownAssetSymbols;

    if (this.state.data.assets !== undefined)
      shownAssetSymbols = this.state.data.assets.map(asset => asset.symbol);

    try {
      fetch(`${CORS_PROXY}https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${shownAssetSymbols}&convert=${currency}`)
          .then(res => res.json())
          .then(response => {

            if (!response.data)
              return;

            var assets = [];

            Object.entries(response.data).forEach(responseAsset => {
              responseAsset = responseAsset[1];

              var holdings = 0;
              var cmc_id = null;

              if (this.state.data.assets) {
                var existingAsset = this.state.data.assets.find(asset => asset.symbol === responseAsset.symbol);

                if (existingAsset) {
                  cmc_id = existingAsset.cmc_id;
                  holdings = existingAsset.holdings;
                }
              }

              if (!cmc_id)
                cmc_id = responseAsset.id;

              assets.push({
                circulating_supply: responseAsset.circulating_supply,
                cmc_id: cmc_id,
                holdings: holdings,
                imageURL: 'https://s2.coinmarketcap.com/static/img/coins/128x128/'+ cmc_id +'.png',
                market_cap: responseAsset.quote[currency].market_cap,
                max_supply: responseAsset.total_supply,
                name: responseAsset.name,
                percent_change_1h: responseAsset.quote[currency].percent_change_1h,
                percent_change_24h: responseAsset.quote[currency].percent_change_24h,
                percent_change_7d: responseAsset.quote[currency].percent_change_7d,
                price: responseAsset.quote[currency].price,
                symbol: responseAsset.symbol,
                volume_24h: responseAsset.quote[currency].volume_24h
              });
            });

            this.storeData(assets);

            this.setState({
              dataUpdated: true,
              timestamp: response.status.timestamp
            });
          });
    }
    catch(e){
      console.log("Error getting Coinmarketcap data:", e)
    }
  }

  fetchAssetData(currency = this.state.settings.currency){
    if (this.state.settings.datasource === "coingecko")
      return this.getCoinGeckoData(currency);

    return this.getCoinMarketCapData(currency);
  }

  async fetchAvailableAssets() {
    var cryptoassets = [];

    const success = res => res.ok ? res.json() : Promise.resolve({});

    var coingecko = fetch(`https://api.coingecko.com/api/v3/coins/list?include_platform=false`).then(success);

    var coinmarketcap = fetch(`${CORS_PROXY}https://web-api.coinmarketcap.com/v1/cryptocurrency/map`).then(success);

    Promise.all([coingecko, coinmarketcap])
      .then(([coingeckoResponse, coinmarketcapResponse]) => {
        if (!coinmarketcapResponse) {
          console.error("Error getting list of assets from CoinMarketCap. Check response.");
        }

        Object.entries(coinmarketcapResponse.data).forEach(responseAsset => {
          responseAsset = responseAsset[1];

          cryptoassets.push({
            cmc_id: responseAsset.id,
            name: responseAsset.name,
            rank: responseAsset.rank,
            symbol: responseAsset.symbol
          });
        });

        if (!coingeckoResponse) {
          console.error("Error getting list of assets from CoinGecko. Check response.");
        }

        Object.entries(coingeckoResponse).forEach(responseAsset => {
          responseAsset = responseAsset[1];

          var existingAsset = cryptoassets.find(asset => asset.symbol === responseAsset.symbol);

          if (!existingAsset) {
            cryptoassets.push({
              name: responseAsset.name,
              symbol: responseAsset.symbol.toUpperCase()
            });
          }
        });

        // Get unique data
        // Todo: Fix root cause
        cryptoassets = Array.from(new Set(cryptoassets.map(a => a.symbol)))
          .map(symbol => {
            return cryptoassets.find(a => a.symbol === symbol)
          })

        cryptoassets = cryptoassets.sort((a, b) => a.rank - b.rank);

        this.storeData(this.state.data.assets, cryptoassets);
      }).catch(e => console.error(e));
  }

  removeCrypto(symbol){
    var assetIndex = this.state.data.assets.findIndex(asset => asset.symbol === symbol.toUpperCase());

    this.state.data.assets.splice(assetIndex, 1);

    this.storeData(this.state.data.assets);
  }

  setFetchInterval() {
    setInterval(async () => {
      this.fetchAssetData();
    }, this.state.settings.fetchInterval || 300000);
  }

  async storeData(assets, cryptoassets = this.state.data.cryptoassets){
    this.setState({
      data: {
        assets: assets,
        cryptoassets: cryptoassets
      }
    });

    localStorage.setItem("data", JSON.stringify(this.state.data));
  }

  toggleShowSettings() {
    this.setState({
      showSettings: !this.state.showSettings
    });
  }

  updateHoldings(value, symbol){
    var assets = this.state.data.assets;

    assets.find(asset => asset.symbol === symbol).holdings = value;

    this.storeData(assets);
  }

  uploadData(file) {
    const reader = new FileReader();

    reader.readAsText(file);

    reader.addEventListener('load', (event) => {
      const result = event.target.result;

      var data = JSON.parse(result);

      if (data.assets) {
        this.storeData(data.assets);
      }
    });
  }

  render() {
    return (
      <div className="page">
        <ThemeProvider theme={this.state.settings.theme || lightTheme}>
          <CssBaseline />

          <Header addCrypto={this.addCrypto.bind(this)} assets={this.state.data.assets} cryptoAssetData={this.state.data.cryptoassets} editSetting={this.editSetting.bind(this)} settings={this.state.settings} toggleShowSettings={this.toggleShowSettings.bind(this)}/>
          <hr />
          <div className="content">
            <CardRow assets={this.state.data.assets} removeCrypto={this.removeCrypto.bind(this)} settings={this.state.settings} updateHoldings={this.updateHoldings.bind(this)} />
          </div>
          <Settings data={this.state.data} editSetting={this.editSetting.bind(this)} settings={this.state.settings} showSettings={this.state.showSettings} theme={this.state.settings.theme || lightTheme} toggleShowSettings={this.toggleShowSettings.bind(this)} uploadData={this.uploadData.bind(this)} />
          <Hotkeys
            keyName="shift+/"
            onKeyDown={this.toggleShowSettings.bind(this)}
          />
          <Snackbar
              action={
                <React.Fragment>
                  <IconButton
                      aria-label="close"
                      color="inherit"
                      onClick={() => this.setState({dataUpdated: false})}
                  >
                    <CloseIcon />
                  </IconButton>
                </React.Fragment>
              }
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              autoHideDuration={Number(this.state.settings.autoHideFetchNotification)}
              key={this.state.timestamp}
              message={`Prices updated: ${new Date(this.state.timestamp).toLocaleString()}`}
              onClose={() => this.setState({dataUpdated: false})}
              open={this.state.dataUpdated}
          />
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
