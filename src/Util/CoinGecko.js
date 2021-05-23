export const getAssetData = async (currency, ids, assets) => {
  if (!currency || !ids) { return }

  try {
    return await window.fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&price_change_percentage=1h%2C24h%2C7d`)
      .then(res => res.json())
      .then(response => {
        if (!response) { return }

        const newAssets = []

        Object.entries(response).forEach(responseAsset => {
          responseAsset = responseAsset[1]

          let cmcId = null
          let exitPlan = []
          let holdings = 0
          let interest = 0

          if (assets) {
            const existingAsset = assets.find(asset => asset.symbol === responseAsset.symbol.toUpperCase())

            if (existingAsset) {
              cmcId = existingAsset.cmcId
              exitPlan = existingAsset.exitPlan || exitPlan
              holdings = existingAsset.holdings || holdings
              interest = existingAsset.interest || interest
            }
          }

          newAssets.push({
            cgId: responseAsset.id,
            circulating_supply: responseAsset.circulating_supply,
            cmcId: cmcId,
            exitPlan: exitPlan,
            holdings: holdings,
            imageURL: responseAsset.image,
            interest: interest,
            market_cap: responseAsset.market_cap,
            max_supply: responseAsset.max_supply,
            name: responseAsset.name,
            percent_change_1h: responseAsset.price_change_percentage_1h_in_currency,
            percent_change_24h: responseAsset.price_change_percentage_24h_in_currency,
            percent_change_7d: responseAsset.price_change_percentage_7d_in_currency,
            price: responseAsset.current_price,
            rank: responseAsset.market_cap_rank,
            symbol: responseAsset.symbol.toUpperCase(),
            total_supply: responseAsset.total_supply,
            url: 'https://www.coingecko.com/en/coins/' + responseAsset.name.toLowerCase().replace(' ', '-'),
            volume_24h: responseAsset.total_volume
          })
        })

        return {
          assets: newAssets,
          timestamp: new Date()
        }
      })
  } catch (e) {
    console.log('Error getting CoinGecko data:', e)
  }
}

export const getAvailableAssets = async () => {
  try {
    return window.fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false')
      .then(res => res.json())
      .then(response => {
        const assets = []

        response.forEach(responseAsset => {
          assets.push({
            cgId: responseAsset.id,
            name: responseAsset.name,
            symbol: responseAsset.symbol
          })
        })

        return assets
      })
  } catch (e) {
    console.log('Error getting list of assets from CoinGecko. Check response.', e)
  }
}

export const getHistoricalAssetData = async (currency, id, days = 1) => {
  if (!currency || !id) { return }

  let time_end = (new Date().getTime() / 1000).toFixed(0);
  let time_start = time_end - (86400 * days);

  try {
    return await window.fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=${currency}&to=${time_end}&from=${time_start}`)
      .then(res => res.json())
      .then(response => {
        return response || null;
      })
  } catch (e) {
    console.log('Error getting Coinmarketcap historical data:', e)
  }
}

export const logo = 'https://static.coingecko.com/s/coingecko-logo-d13d6bcceddbb003f146b33c2f7e8193d72b93bb343d38e392897c3df3e78bdd.png'
export const logoWhite = 'https://static.coingecko.com/s/coingecko-logo-white-3f2aeb48e13428b7199395259dbb96280bf47ea05b2940ef7d3e87c61e4d8408.png'
