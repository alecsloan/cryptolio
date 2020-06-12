import Card from './Components/Card.js';
import Header from './Components/Header.js';
import Hotkeys from 'react-hot-keys';
import React, { Component } from 'react';
import Settings from './Components/Settings.js';

import './styles/App.css';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
const BASE_URL = 'https://web-api.coinmarketcap.com/v1/cryptocurrency'

function CardRow(props) {
  var cards = [];

  if (!props.coins)
    return <div></div>;

  props.coins.forEach(coin => {
    cards.push(<Card coin={coin} key={coin.symbol} removeCrypto={props.removeCrypto.bind(this)} settings={props.settings} updateHoldings={props.updateHoldings.bind(this)}/>)
  });

  return <div className="cardRow">{cards}</div>;
}

class App extends Component {
  constructor(props){
    super(props);

    var initialData = JSON.parse(localStorage.getItem("data")) || {coins: []};
    var initialSettings = JSON.parse(localStorage.getItem("settings")) || {
      addDropdownHideable: false,
      currency: "USD",
      datasource: "coinmarketcap",
      decimals2: 100,
      decimals3: 1,
      decimals4: null,
      fetchInterval: 300000,
      limit: 200,
      show1hChange: true,
      show24hChange: true,
      show7dChange: true,
      showCardBalances: true,
      showPortfolioBalance: true,
      sliderMax: 10000
    };

    this.state ={
      data: {
        coins: initialData.coins
      },
      cards: [],
      showSettings: false,
      settings: initialSettings
    };

    if (!initialData.coins || initialData.coins.length === 0)
      this.addCrypto(1, "bitcoin", "BTC");

    this.fetchCoins();
  }

  addCrypto(cmc_id, cg_id, symbol){
    if (!cmc_id)
      return;

    var coins = this.state.data.coins;

    coins.push({
      cmc_id: cmc_id,
      cg_id: cg_id,
      symbol: symbol
    });

    this.setState({
      data: {coins: coins},
    });

    this.fetchCoins();
  }

  componentDidMount(){
    this.setFetchInterval();
  }

  editSetting(settingName, value) {
    if (!settingName)
      return;

    if (settingName === "currency" && !value)
      value = "USD";

    if (settingName === "fetchInterval" && value < 6000)
      value = 60000;

    var settings = this.state.settings;

    settings[settingName] = value;

    this.fetchCoins((settingName === "currency") ? value : this.state.settings.currency);

    this.setState({
      settings: settings
    });

    localStorage.setItem("settings", JSON.stringify(settings));
  }

  getCoinGeckoData(currency) {
    var shownAssetIds;

    if (this.state.data.coins !== undefined)
      shownAssetIds = this.state.data.coins.map(asset => asset.cg_id);

    try {
      fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${shownAssetIds}&price_change_percentage=1h%2C24h%2C7d`)
          .then(res => res.json())
          .then(response => {

            if (!response)
              return;

            var assets = [];

            Object.entries(response).forEach(responseAsset => {
              responseAsset = responseAsset[1];

              var holdings = 0;
              var cg_id = null;
              var cmc_id = null;

              if (this.state.data.coins !== undefined) {
                var existingAsset = this.state.data.coins.find(asset => asset.symbol === responseAsset.symbol.toUpperCase());

                if (existingAsset) {
                  cg_id = existingAsset.cg_id;
                  cmc_id = existingAsset.cmc_id;
                  holdings = existingAsset.holdings;
                }
              }

              assets.push({
                cg_id: cg_id || responseAsset.id,
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
    var shownAssetIds;

    if (this.state.data.coins !== undefined)
      shownAssetIds = this.state.data.coins.map(asset => asset.cmc_id);

    try {
      fetch(`${CORS_PROXY}${BASE_URL}/quotes/latest?id=${shownAssetIds}&convert=${currency}`)
          .then(res => res.json())
          .then(response => {

            if (!response.data)
              return;

            var assets = [];

            Object.entries(response.data).forEach(responseAsset => {
              responseAsset = responseAsset[1];

              var holdings = 0;
              var cg_id = null;
              var cmc_id = null;

              if (this.state.data.coins !== undefined) {
                var existingAsset = this.state.data.coins.find(asset => asset.symbol === responseAsset.symbol);
                cg_id = existingAsset.cg_id;
                cmc_id = existingAsset.cmc_id;
                holdings = existingAsset.holdings;
              }

              if (!cmc_id)
                cmc_id = responseAsset.id;

              assets.push({
                cg_id: cg_id,
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
          });
    }
    catch(e){
      console.log("Error getting Coinmarketcap data:", e)
    }
  }

  fetchCoins(currency = this.state.settings.currency){
    if (this.state.settings.datasource === "coingecko")
      return this.getCoinGeckoData(currency);

    return this.getCoinMarketCapData(currency);
  }

  removeCrypto(symbol){
    var assetIndex = this.state.data.coins.findIndex(asset => asset.symbol === symbol.toUpperCase());

    this.state.data.coins.splice(assetIndex, 1);

    this.storeData(this.state.data.coins);
  }

  setFetchInterval() {
    setInterval(async () => {
      this.fetchCoins();
    }, this.state.settings.fetchInterval || 300000);
  }

  async storeData(coins){
    this.setState({
      data: {coins: coins}
    });

    localStorage.setItem("data", JSON.stringify(this.state.data));
  }

  toggleShowSettings() {
    this.setState({
      showSettings: !this.state.showSettings
    });
  }

  updateHoldings(event, coin){
    let value = parseFloat(event.target.value);

    var coins = this.state.data.coins;

    if (value){
      coins.find(asset => asset.symbol === coin.symbol.toUpperCase()).holdings = value;
    }

    this.storeData(coins);
  }

  uploadData(file) {
    const reader = new FileReader();

    reader.readAsText(file);

    reader.addEventListener('load', (event) => {
      const result = event.target.result;

      var data = JSON.parse(result);

      if (data.coins) {
        this.storeData(data.coins);
      }
    });
  }

  render() {
    return (
      <div className="page">
        <Header addCrypto={this.addCrypto.bind(this)} coins={this.state.data.coins} settings={this.state.settings} toggleShowSettings={this.toggleShowSettings.bind(this)}/>
        <hr />
        <div className="content">
          <CardRow coins={this.state.data.coins} removeCrypto={this.removeCrypto.bind(this)} settings={this.state.settings} updateHoldings={this.updateHoldings.bind(this)} />
        </div>
        <Settings data={this.state.data} editSetting={this.editSetting.bind(this)} settings={this.state.settings} showSettings={this.state.showSettings} toggleShowSettings={this.toggleShowSettings.bind(this)} uploadData={this.uploadData.bind(this)} />
        <Hotkeys
          keyName="shift+/"
          onKeyDown={this.toggleShowSettings.bind(this)}
        />
      </div>
    );
  }
}

export default App;
