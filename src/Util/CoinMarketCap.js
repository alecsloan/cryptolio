const CORS_PROXY = 'https://cors.bridged.cc/'
const GIRDA_API_KEY = '' //See https://github.com/girdaco/base/issues/23

export const getAssetData = async (currency, symbols, assets) => {
  if (!currency || !symbols || !GIRDA_API_KEY) { return }

  try {
    return await window.fetch(
        `${CORS_PROXY}https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=${currency}`,
      {
          headers: {
            'x-cors-grida-api-key': `${GIRDA_API_KEY}`
          }
        }
      )
      .then(res => res.json())
      .then(response => {
        if (!response.data) { return }

        const newAssets = []

        Object.entries(response.data).forEach(responseAsset => {
          responseAsset = responseAsset[1]

          let cgId = null
          let cmcId = null
          let exitPlan = []
          let holdings = 0
          let interest = 0

          if (assets) {
            const existingAsset = assets.find(asset => asset.symbol === responseAsset.symbol)

            if (existingAsset) {
              cgId = existingAsset.cgId
              cmcId = existingAsset.cmcId
              exitPlan = existingAsset.exitPlan || exitPlan
              holdings = existingAsset.holdings || holdings
              interest = existingAsset.interest || interest
            }
          }

          if (!cmcId) { cmcId = responseAsset.id }

          newAssets.push({
            cgId: cgId,
            circulating_supply: responseAsset.circulating_supply,
            cmcId: cmcId,
            exitPlan: exitPlan,
            holdings: holdings,
            imageURL: 'https://s2.coinmarketcap.com/static/img/coins/128x128/' + cmcId + '.png',
            interest: interest,
            market_cap: responseAsset.quote[currency].market_cap,
            max_supply: responseAsset.max_supply,
            name: responseAsset.name,
            percent_change_1h: responseAsset.quote[currency].percent_change_1h,
            percent_change_24h: responseAsset.quote[currency].percent_change_24h,
            percent_change_7d: responseAsset.quote[currency].percent_change_7d,
            price: responseAsset.quote[currency].price,
            rank: responseAsset.cmc_rank,
            symbol: responseAsset.symbol,
            total_supply: responseAsset.total_supply,
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
  if (!GIRDA_API_KEY) return []

  try {
    return window.fetch(
        `${CORS_PROXY}https://web-api.coinmarketcap.com/v1/cryptocurrency/map`,
        {
          headers: {
            'x-cors-grida-api-key': `${GIRDA_API_KEY}`
          }
        }
      )
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

export const getHistoricalAssetData = async (currency, symbols, days = 7) => {
  if (!currency || !symbols || !GIRDA_API_KEY) { return }

  let interval = 'hourly'

  if (days > 29) {
    interval = 'daily'
  }

  let time_end = (new Date().getTime() / 1000).toFixed(0)
  let time_start = time_end - Math.round(86400 * days)

  try {
    return await window.fetch(
        `${CORS_PROXY}https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical?format=chart_crypto_details&symbol=${symbols}&convert=${currency}&interval=${interval}&time_end=${time_end}&time_start=${time_start}`,
        {
          headers: {
            'x-cors-grida-api-key': `${GIRDA_API_KEY}`
          }
        }
      )
      .then(res => res.json())
      .then(response => {
        return response.data || null
      })
  } catch (e) {
    console.log('Error getting Coinmarketcap historical data:', e)
  }
}

const logoBase = 'https://s2.coinmarketcap.com/static/cloud/img/coinmarketcap'

export const logo = logoBase + '_1.svg'
export const logoWhite = logoBase + '_white_1.svg'
