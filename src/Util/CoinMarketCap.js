const CORS_PROXY = 'https://cors.bridged.cc/'

export const getAssetData = async (currency, symbols, assets) => {
  if (!currency || !symbols) { return }

  try {
    return await window.fetch(`${CORS_PROXY}https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=${currency}`)
      .then(res => res.json())
      .then(response => {
        if (!response.data) { return }

        const newAssets = []

        Object.entries(response.data).forEach(responseAsset => {
          responseAsset = responseAsset[1]

          let cmcId = null
          let exitPlan = []
          let holdings = 0
          let interest = 0

          if (assets) {
            const existingAsset = assets.find(asset => asset.symbol === responseAsset.symbol)

            if (existingAsset) {
              cmcId = existingAsset.cmcId
              exitPlan = existingAsset.exitPlan || exitPlan
              holdings = existingAsset.holdings || holdings
              interest = existingAsset.interest || interest
            }
          }

          if (!cmcId) { cmcId = responseAsset.id }

          newAssets.push({
            circulating_supply: responseAsset.circulating_supply,
            cmcId: cmcId,
            exitPlan: exitPlan,
            holdings: holdings,
            imageURL: 'https://s2.coinmarketcap.com/static/img/coins/128x128/' + cmcId + '.png',
            interest: interest,
            market_cap: responseAsset.quote[currency].market_cap,
            max_supply: responseAsset.total_supply,
            name: responseAsset.name,
            percent_change_1h: responseAsset.quote[currency].percent_change_1h,
            percent_change_24h: responseAsset.quote[currency].percent_change_24h,
            percent_change_7d: responseAsset.quote[currency].percent_change_7d,
            price: responseAsset.quote[currency].price,
            symbol: responseAsset.symbol,
            url: 'https://coinmarketcap.com/currencies/' + responseAsset.slug,
            volume_24h: responseAsset.quote[currency].volume_24h
          })
        })

        return {
          assets: newAssets,
          timestamp: response.status.timestamp
        }
      })
  } catch (e) {
    console.log('Error getting Coinmarketcap data:', e)
  }
}

export const getAvailableAssets = async () => {
  try {
    return window.fetch(`${CORS_PROXY}https://web-api.coinmarketcap.com/v1/cryptocurrency/map`)
      .then(res => res.json())
      .then(response => {
        const assets = []

        response.data.forEach(responseAsset => {
          assets.push({
            cmcId: responseAsset.id,
            name: responseAsset.name,
            rank: responseAsset.rank,
            symbol: responseAsset.symbol
          })
        })

        return assets
      })
  } catch (e) {
    console.log('Error getting list of assets from CoinMarketCap. Check response.', e)
  }
}

const logoBase = 'https://s2.coinmarketcap.com/static/cloud/img/coinmarketcap'

export const logo = logoBase + '_1.svg'
export const logoWhite = logoBase + '_white_1.svg'
