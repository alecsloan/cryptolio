import React, { Component } from 'react';
import logo from './logo.svg';
import CoinMarketCap from '/node_modules/coinmarketcap-api';
import Card from './Components/Card.js';
import Header from './Components/Header.js';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      coins: '',
      show: require('./Server/data.json'),
      cards: []
    };
  }

  componentDidMount(){
    this.fetchCoins()
    try{
      setInterval(async () => {
        this.fetchCoins()
      }, 300000);
    }catch(e){
      console.log("Error getting Coin Market Cap data:", e)
    }
  }


  componentDidUpdate(){
    this.saveFile();
  }

  fetchCoins(){
    const client = new CoinMarketCap();
    var coinPromise = client.getTicker().catch(console.error);
    coinPromise.then(
      function(data){
        this.setState({
          coins: data.data
        });
        this.updateCards();
      }.bind(this)
    );
    console.log("Coins Updated");
  }

  addCrypto(coin){
    if (!this.state.show.includes(coin)){
      this.setState({show: this.state.show.concat(coin)});
    }
    this.updateCards(coin, 'add');
  }

  removeCrypto(coin){
    if (this.state.show.includes(coin)){
      var index = this.state.show.indexOf(coin);
      if (index > -1) {
        this.state.show.splice(index, 1);
      }
    }
    this.updateCards(coin, 'remove');
  }

  saveFile(){
    fetch('//localhost:5000/save-file', {
      method: 'POST',
      body: JSON.stringify(this.state.show, null, '\t')
    });
  }

  updateCards(coin, task){
    let cards = [];
    for (const key of Object.entries(this.state.coins)) {
      {/*If it exists in the show state, or if it was added, and not if it was removed*/}
      if((this.state.show.includes(key[1].symbol) || (key[1].symbol === coin && task === 'add')) && !(task === 'remove' && key[1].symbol === coin))
          cards.push(<Card coin={key[1]} key={key[1].name} removeCrypto={this.removeCrypto.bind(this)}/>)
    }
    this.setState({
      cards: cards
    });
  }

  render() {
    if(!Object.keys(this.state.coins).length)
      return null;


    return (
      <div className="App">
        <Header addCrypto={this.addCrypto.bind(this)} coins={this.state.coins}/>
        <hr />
        <div className="page">
          <div className="cardRow">
            {this.state.cards}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
