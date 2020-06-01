import Card from './Components/Card.js';
import Header from './Components/Header.js';
import React, { Component } from 'react';
import Settings from './Components/Settings.js';

import './styles/App.css';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
const BASE_URL = 'https://web-api.coinmarketcap.com/v1/cryptocurrency'

class App extends Component {
  constructor(props){
    super(props);

    var initialData = JSON.parse(localStorage.getItem("data")) || [];
    var initialSettings = JSON.parse(localStorage.getItem("settings")) || {
      show1hChange: true,
      show24hChange: true,
      show7dChange: true,
      currency: "USD",
      limit: 200,
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

    this.fetchCoins();
  }

  addCrypto(id){
    if (!id)
      return;

    var coins = this.state.data.coins;

    coins[id] = {id: id};

    this.setState({
      data: {coins: coins},
    });

    this.fetchCoins();
  }

  componentDidMount(){
    setInterval(async () => {
      this.fetchCoins();
    }, 300000);
  }

  editSetting(settingName, value) {
    if (!settingName)
      return;

    if (settingName === "currency" && !value)
      value = "USD";

    var settings = this.state.settings;

    settings[settingName] = value;

    this.fetchCoins((settingName === "currency") ? value : this.state.settings.currency);

    this.setState({
      settings: settings
    });

    localStorage.setItem("settings", JSON.stringify(settings));
  }

  fetchCoins(currency = this.state.settings.currency){
    var shownAssetIds = 1;

    if (this.state.data.coins !== undefined)
      shownAssetIds = Object.keys(this.state.data.coins);

    try {
      fetch(`${CORS_PROXY}${BASE_URL}/quotes/latest?id=${shownAssetIds}&convert=${currency}`, {headers: {'origin': 'x-requested-with'}})
          .then(res => res.json())
          .then(response => {

            if (this.state.data.coins !== undefined) {
              Object.keys(this.state.data.coins).forEach(id => {
                response.data[id].holdings = this.state.data.coins[id].holdings;
              });
            }

            this.storeData(response.data);
          });
    }
    catch(e){
      console.log("Error getting Coinmarketcap data:", e)
    }
  }

  getCards(){
    var cards = [];

    if (!this.state.data.coins)
      return

    Object.entries(this.state.data.coins).forEach(([id, coin]) => {
      if (coin.quote && coin.quote[this.state.settings.currency])
        cards.push(<Card coin={coin} key={coin.symbol} removeCrypto={this.removeCrypto.bind(this)} settings={this.state.settings} updateHoldings={this.updateHoldings.bind(this)}/>)
    });

    return cards;
  }

  removeCrypto(id){
    delete this.state.data.coins[id];

    this.storeData(this.state.data.coins);
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
    let value = parseFloat(event.target.value).toFixed(9);

    var coins = this.state.data.coins;

    if (value){
      coins[coin.id].holdings = value;
    }

    this.storeData(coins);
  }

  render() {
    return (
      <div className="page">
        <Header addCrypto={this.addCrypto.bind(this)} coins={this.state.data.coins} limit={this.state.settings.limit} toggleShowSettings={this.toggleShowSettings.bind(this)}/>
        <hr />
        <div className="content">
          <div className="cardRow">
            {this.getCards()}
          </div>
        </div>
        <Settings editSetting={this.editSetting.bind(this)} settings={this.state.settings} showSettings={this.state.showSettings} toggleShowSettings={this.toggleShowSettings.bind(this)} />
      </div>
    );
  }
}

export default App;
