import React, { Component } from 'react';
import Card from './Components/Card.js';
import Header from './Components/Header.js';
import Settings from './Components/Settings.js';
import './styles/App.css';

class App extends Component {
  constructor(props){
    super(props);
    var initialData = JSON.parse(localStorage.getItem("data")) || [];
    var initialSettings = JSON.parse(localStorage.getItem("settings")) || {
      show1hChange: true,
      show24hChange: true,
      show7dChange: true,
      currency: "USD"
    };

    this.state ={
      data: {
        coins: initialData.coins
      },
      cards: [],
      showSettings: false,
      settings: initialSettings
    };

    if (initialData.coins) {
      var shownCoins = initialData.coins.filter(coin => coin.show);

      shownCoins.forEach((shownCoin) => {
        var coinIndex = initialData.coins.findIndex(coin => coin.symbol === shownCoin.symbol);
        var coin = initialData.coins[coinIndex];

        this.updateCards(coin, 'add');
      });
    }
    else {
      this.fetchCoins();
    }
  }

  componentDidMount(){
    setInterval(async () => {
      this.fetchCoins();
    }, 60000);
  }

  fetchCoins(){
    try {
      fetch('http://localhost:5000/fetch-coins')
          .then(res => res.json())
          .then(response => {

            if (this.state.data.coins) {
              var shownCoins = this.state.data.coins.filter(coin => coin.show);

              shownCoins.forEach((shownCoin) => {
                var coinIndex = response.coins.findIndex(coin => coin.symbol === shownCoin.symbol);
                var coin = response.coins[coinIndex];

                coin.show = true;
                coin.holdings = shownCoin.holdings;
              });
            } else {
              response.coins[0].show = true;
              this.updateCards(response.coins[0], 'add');
            }

            this.setState({
              data: {coins: response.coins},
            });

            this.storeData();
          });
    }
    catch(e){
      console.log("Error getting Coin Market Cap data:", e)
    }
  }

  addCrypto(symbol){
    if (!symbol)
      return;

    var coin = this.state.data.coins.find(coin => coin.symbol === symbol);

    if (coin.show)
      return;

    coin['show'] = true;

    this.setState({
      data: {coins: this.state.data.coins},
    });

    this.updateCards(coin, 'add');

    this.storeData();
  }

  removeCrypto(symbol){
    var coins = this.state.data.coins;
    var coinIndex = coins.findIndex(coin => coin.symbol === symbol);

    coins[coinIndex].show = false;

    this.setState({
      data: {coins: coins},
    });

    this.updateCards(symbol, 'remove');

    this.storeData();
  }

  editSetting(settingName, value) {
    if (!settingName)
      return;

    if (settingName === 'currency' && !value)
      value = "USD";

    var settings = this.state.settings;

    settings[settingName] = value;

    //This may be temporary. Need to find a better way to update the cards.
    var cards = [];

    this.state.cards.forEach((card) => {
      cards.push(<Card coin={card.coin} key={card.key} removeCrypto={this.removeCrypto.bind(this)} settings={settings} updateHoldings={this.updateHoldings.bind(this)}/>)
    });

    this.setState({
      settings: settings,
      cards: cards
    });

    localStorage.setItem('settings', JSON.stringify(settings));
  }

  toggleShowSettings() {
    this.setState({
      showSettings: !this.state.showSettings
    });
  }

  updateHoldings(event, coin){
    let value = parseFloat(event.target.value).toFixed(9);

    if (value){
      var coins = this.state.data.coins;
      var coinIndex = coins.findIndex(curCoin => curCoin.symbol === coin.symbol);

      coins[coinIndex].holdings = parseFloat(value);

      this.setState({
        data: {coins: coins},
      });
    }

    this.storeData();
  }

  async storeData(){
    localStorage.setItem('data', JSON.stringify(this.state.data));
  }

  updateCards(coin, task){
    let cards = this.state.cards;

    if (coin && task === 'remove'){
      var coinIndex = cards.findIndex(card => card.key === coin);

      cards.splice(coinIndex, 1);
    }
    else if (coin){
      cards.push(<Card coin={coin} key={coin.symbol} removeCrypto={this.removeCrypto.bind(this)} settings={this.state.settings} updateHoldings={this.updateHoldings.bind(this)}/>)
    }

    this.setState({
      cards: cards
    });
  }

  render() {
    return (
      <div className="page">
        <Header addCrypto={this.addCrypto.bind(this)} coins={this.state.data.coins} toggleShowSettings={this.toggleShowSettings.bind(this)}/>
        <hr />
        <div className="content">
          <div className="cardRow">
            {this.state.cards}
          </div>
        </div>
        <Settings editSetting={this.editSetting.bind(this)} settings={this.state.settings} showSettings={this.state.showSettings} toggleShowSettings={this.toggleShowSettings.bind(this)} />
      </div>
    );
  }
}

export default App;
