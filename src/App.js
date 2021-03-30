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
import {Alert} from "@material-ui/lab";
import AssetUtilities from "./Components/AssetUtilities";

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

  var assets = props.assets;

  if (!assets)
    return null;

  if (props.settings.sorting === "price") {
    assets = assets.sort((a, b) => b.price - a.price);
  }
  else if (props.settings.sorting === "marketcap") {
    assets = assets.sort((a, b) => b.market_cap - a.market_cap);
  }
  else if (props.settings.sorting === "1h") {
    assets = assets.sort((a, b) => b.percent_change_1h - a.percent_change_1h);
  }
  else if (props.settings.sorting === "24h") {
    assets = assets.sort((a, b) => b.percent_change_24h - a.percent_change_24h);
  }
  else if (props.settings.sorting === "7d") {
    assets = assets.sort((a, b) => b.percent_change_7d - a.percent_change_7d);
  }
  else {
    assets = assets.sort((a, b) => ((b.holdings || .000001) * b.price) - ((a.holdings || .000001) * a.price));
  }

  assets.forEach(asset => {
    cards.push(<AssetCard asset={asset} key={asset.symbol} removeCrypto={props.removeCrypto.bind(this)} settings={props.settings} setAssetUtilityShown={props.setAssetUtilityShown.bind(this)} updateHoldings={props.updateHoldings.bind(this)} />)
  });

  return <div className="cardRow">{cards}</div>;
}

class App extends Component {
  constructor(props){
    super(props);

    var initialData = JSON.parse(localStorage.getItem("data")) || {assets: [{ cmc_id: 1817, symbol: "VGX" }], cryptoassets: []};
    var initialSettings = JSON.parse(localStorage.getItem("settings")) || {
      addDropdownHideable: false,
      assetUtilityShown: null,
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
      sorting: "balance",
      theme: lightTheme
    };

    initialSettings.theme = createMuiTheme(initialSettings.theme);

    this.state ={
      data: {
        assets: initialData.assets,
        cryptoassets: initialData.cryptoassets,
      },
      dataUpdated: false,
      showSettings: false,
      settings: initialSettings,
      timestamp: null
    };

    if (!this.state.data.cryptoassets || this.state.data.cryptoassets.length === 0) {
      this.fetchAvailableAssets();
    }
  }

  addCrypto(cmc_id, symbol){
    if (this.state.data.assets.find(asset => asset.symbol === symbol))
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
      value = 6000;
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
    if (!this.state.data.assets)
      return;

    var shownAssetSymbols = this.state.data.assets.map(asset => asset.symbol.toLowerCase());

    try {
      fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&symbols=${shownAssetSymbols}&price_change_percentage=1h%2C24h%2C7d`)
          .then(res => res.json())
          .then(response => {

            if (!response)
              return;

            var assets = [];

            Object.entries(response).forEach(responseAsset => {
              responseAsset = responseAsset[1];

              var cmc_id = null;
              var exitPlan = [];
              var holdings = 0;

              if (this.state.data.assets !== undefined) {
                var existingAsset = this.state.data.assets.find(asset => asset.symbol === responseAsset.symbol.toUpperCase());

                if (existingAsset) {
                  cmc_id = existingAsset.cmc_id;
                  exitPlan = existingAsset.exitPlan || exitPlan;
                  holdings = existingAsset.holdings || holdings;
                }
              }

              assets.push({
                circulating_supply: responseAsset.circulating_supply,
                cmc_id: cmc_id,
                exitPlan: exitPlan,
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
                url: "https://www.coingecko.com/en/coins/" + responseAsset.name.toLowerCase().replace(" ", "-"),
                volume_24h: responseAsset.total_volume
              });
            });

            this.storeData(assets);

            this.setState({
              dataUpdated: true,
              timestamp: new Date()
            });
          });
    }
    catch(e){
      console.log("Error getting CoinGecko data:", e)
    }
  }

  getCoinMarketCapData(currency) {
    if (!this.state.data.assets)
      return;

    var shownAssetSymbols = this.state.data.assets.map(asset => asset.symbol);

    try {
      fetch(`${CORS_PROXY}https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${shownAssetSymbols}&convert=${currency}`)
          .then(res => res.json())
          .then(response => {

            if (!response.data)
              return;

            var assets = [];

            Object.entries(response.data).forEach(responseAsset => {
              responseAsset = responseAsset[1];

              var cmc_id = null;
              var exitPlan = [];
              var holdings = 0;

              if (this.state.data.assets) {
                var existingAsset = this.state.data.assets.find(asset => asset.symbol === responseAsset.symbol);

                if (existingAsset) {
                  cmc_id = existingAsset.cmc_id;
                  exitPlan = existingAsset.exitPlan || exitPlan;
                  holdings = existingAsset.holdings || holdings;
                }
              }

              if (!cmc_id)
                cmc_id = responseAsset.id;

              assets.push({
                circulating_supply: responseAsset.circulating_supply,
                cmc_id: cmc_id,
                exitPlan: exitPlan,
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
                url: "https://coinmarketcap.com/currencies/" + responseAsset.slug,
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

        this.fetchAssetData();
      }).catch(e => console.error(e));
  }

  removeCrypto(symbol){
    var assetIndex = this.state.data.assets.findIndex(asset => asset.symbol === symbol.toUpperCase());

    this.state.data.assets.splice(assetIndex, 1);

    this.storeData(this.state.data.assets);
  }

  setAssetUtilityShown(asset) {
    this.setState({
      assetUtilityShown: asset
    });
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

  updateExitPlan(rows, symbol) {
    var assets = this.state.data.assets;

    assets.find(asset => asset.symbol === symbol).exitPlan = rows;

    this.storeData(assets);
  }

  render() {
    return (
      <div className="page">
        <ThemeProvider theme={this.state.settings.theme || lightTheme}>
          <CssBaseline />

          <Header addCrypto={this.addCrypto.bind(this)} assets={this.state.data.assets} cryptoAssetData={this.state.data.cryptoassets} editSetting={this.editSetting.bind(this)} refreshData={this.fetchAssetData.bind(this)} settings={this.state.settings} toggleShowSettings={this.toggleShowSettings.bind(this)}/>
          <hr />
          <div className="content">
            <CardRow assets={this.state.data.assets} removeCrypto={this.removeCrypto.bind(this)} settings={this.state.settings} setAssetUtilityShown={this.setAssetUtilityShown.bind(this)} updateHoldings={this.updateHoldings.bind(this)} />
          </div>
          <Settings data={this.state.data} editSetting={this.editSetting.bind(this)} settings={this.state.settings} showSettings={this.state.showSettings} theme={this.state.settings.theme || lightTheme} toggleShowSettings={this.toggleShowSettings.bind(this)} uploadData={this.uploadData.bind(this)} />
          <AssetUtilities asset={this.state.assetUtilityShown} settings={this.state.settings} setAssetUtilityShown={this.setAssetUtilityShown.bind(this)} updateExitPlan={this.updateExitPlan.bind(this)} />
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
              onClose={() => this.setState({dataUpdated: false})}
              open={this.state.dataUpdated}
          >
            <Alert onClose={() => this.setState({dataUpdated: false})} severity="success">
              Prices updated: {new Date(this.state.timestamp).toLocaleString()}
            </Alert>
          </Snackbar>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
