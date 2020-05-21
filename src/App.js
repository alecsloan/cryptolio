import React, { Component } from 'react';
import Card from './Components/Card.js';
import Header from './Components/Header.js';
import axios from 'axios';
import './styles/App.css';

class App extends Component {
  constructor(props){
    super(props);
    var initialData;
    try{
      initialData = require('./data.json')
    }catch(e){
      initialData = []
    }

    this.state ={
      data: {
        coins: initialData.coins
      },
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

  fetchCoins(){
    const host = axios.create({baseURL: 'http://localhost:5000'})

    host.get('/fetch-coins', {
      shownCoins: Object.keys(this.state.data.coins).toString(),
      coins: this.state.data.coins
    }).then(function (response) {
      this.setState({
        data: {...this.state.data, coins: response.data.coins},
      });

      this.updateCards('pass', 'add');
    }.bind(this)).catch(function (error) {
      console.log(error);
    });
  }

  addCrypto(coin){
    if (!this.state.data.coins[coin]){
      this.setState({
        data: {...this.state.data, coins:this.state.data.coins.concat(coin)}
      });
    }

    this.fetchCoins();
    this.updateCards(coin, 'add');
  }

  removeCrypto(coin){
    if (this.state.data.show.includes(coin)){
      var index = this.state.data.show.indexOf(coin);
      if (index > -1) {
        this.state.data.show.splice(index, 1);
      }
    }
    this.updateCards(coin, 'remove');
  }

  updateHoldings(event, coin){
    let value = parseFloat(event.target.value).toFixed(9);
    if (value){
      //parseFloat again to get rid of trailing 0's
      coin['holdings'] = parseFloat(value);
    }
  }

  saveFile(){
    //Server set to host on port 5000
    const host = axios.create({baseURL: 'http://localhost:5000'})
    //Ping the server
    host.get('', {
    //Server is Online
    }).then(function (response) {
      //Call save-file on server
      host.post('/save-file', {
        data: JSON.stringify(this.state.data, null, '\t')
      //File was saved successfully
      }).then(function (response) {
        console.log(response.data.status);
      //File failed to save
      }).catch(function (error) {
        console.log(error);
      });
    //Ping to the server failed
    }.bind(this)).catch(function (error) {
      console.log("Server Down, run node server.js in the project directory. " + error);
    });
  }

  updateCards(coin, task){
    let cards = [];
    if (coin){
    for (const key of Object.entries(this.state.data.coins)) {
      //If it exists in the show state, or if it was added, and not if it was removed
      cards.push(<Card coin={key[1]} key={key[1].name} removeCrypto={this.removeCrypto.bind(this)} updateHoldings={this.updateHoldings.bind(this)}/>)
    }
    this.setState({
      cards: cards
    }, () => {
      this.saveFile();
    });
    }
  }

  render() {
    return (
      <div className="page">
        <Header addCrypto={this.addCrypto.bind(this)} coins={this.state.data.coins}/>
        <hr />
        <div className="content">
          <div className="cardRow">
            {this.state.cards}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
