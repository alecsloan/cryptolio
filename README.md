[![Netlify Status](https://api.netlify.com/api/v1/badges/1d54e4f5-13f5-4dec-a155-5d69e41b56b0/deploy-status)](https://app.netlify.com/sites/cryptodash-demo/deploys)

# Explore the world of cryptoassets
## Simulate price gain or drop to see your earning potential!

* Balance tracking
* Simulate your holding value at price targets
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
* Add full configuration for color picking so users can set their own colors/gradients
* Add multi-language support
* Make it more clear that prices and value changes were updated (maybe similar to what CMC does?)
* Add link to CMC/CG page if someone clicks on the asset name/symbol
* Add configuration for hiding CryptoDash title
* Add Skeleton for cards while loading
* Add different layout views (table, main portfolio change chart with small cards, etc.)
* Move the Simulation, Interest Calculator, and Exit Planning sections to a drawer or modal instead of the card
* Add more info about the asset on the back of the card (Circ supply, max supply, market cap, etc)