[![Netlify Status](https://api.netlify.com/api/v1/badges/1d54e4f5-13f5-4dec-a155-5d69e41b56b0/deploy-status)](https://app.netlify.com/sites/cryptodash-demo/deploys)

# Explore the world of cryptoassets
## Simulate price gain or drop to see your earning potential!

* Balance tracking
* All symbols listed
    * Only see info on the assets you want to see
* Multi-currency
* Source data from CoinMarketCap or CoinGecko
* Data import/export
* 1h / 24h / 7d price display

## Installation
``` sh
git clone https://github.com/alecsloan/cryptodash
cd cryptodash
npm install
```

## Usage

Just run `npm start`

## Images

### Desktop
![Desktop Image](https://imgur.com/8MrMJvP.png)

##### Simulation
![Simulation Image](https://imgur.com/N0hG15f.png)

##### Settings
![Settings Image](https://imgur.com/hQwHuxm.png)

### Mobile

![Mobile Image](https://imgur.com/HxhUnR5.png)

# Todo
* Add a light theme
* Add an input field for simulated price, value, and marketcap for better analysis
* Add full configuration for color picking so users can set their own colors/gradients
* Add setting for sorting cards (Market Cap, holdings, price, etc)
* Add multi-language support
* Switch cards to MUI

## Changelog
#### v0.4.0
* ~~Add datasource options so other apis can be used (I.E. Coingecko)~~
* ~~Data export/import~~
#### v0.3.0
* ~~Add setting for coin fetch interval~~
* ~~Add setting for decimal places depending on price of currency. (I.E. >$500 remove decimal places, <$1 show 5 decimal places)~~
* ~~Add a portfolio balance field~~