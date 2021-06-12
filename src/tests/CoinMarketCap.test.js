import * as CoinMarketCap from '../Util/CoinMarketCap'

window.it('get available assets from CoinMarketCap', async () => {
  const assets = await CoinMarketCap.getAvailableAssets()

  expect(assets.length).toBeGreaterThan(0)

  const bitcoin = assets.find(asset => asset.symbol === 'BTC')

  expect(bitcoin.name).toBe('Bitcoin')
  expect(bitcoin.cmcId).toEqual(1)

  const xrp = assets.find(asset => asset.symbol === 'XRP')

  expect(xrp.name).toBe('XRP')
  expect(xrp.cmcId).toEqual(52)
})

window.it('get single asset data from CoinMarketCap', async () => {
  const response = await CoinMarketCap.getAssetData('USD', 'btc', null)

  const assets = response.assets

  expect(assets.length).toEqual(1)

  const asset = assets[0]

  expect(asset.name).toBe('Bitcoin')
  expect(asset.symbol).toBe('BTC')
  expect(asset.max_supply).toEqual(21000000)
})

window.it('get multiple asset data from CoinMarketCap', async () => {
  const response = await CoinMarketCap.getAssetData('USD', 'btc,xrp', null)

  const assets = response.assets

  expect(assets.length).toEqual(2)

  const bitcoin = assets[0]

  expect(bitcoin.name).toBe('Bitcoin')
  expect(bitcoin.symbol).toBe('BTC')
  expect(bitcoin.max_supply).toEqual(21000000)

  const xrp = assets[1]

  expect(xrp.name).toBe('XRP')
  expect(xrp.symbol).toBe('XRP')
  expect(xrp.max_supply).toEqual(100000000000)
})

window.it('get single asset historical data from CoinMarketCap', async () => {
  const response = await CoinMarketCap.getHistoricalAssetData('USD', 'BTC', 7)

  const assets = Object.keys(response)

  expect(assets.length).toBe(168)

  const currentUnixTimeSeconds = new Date().getTime() / 1000
  const latestDataPointUnixTimeSeconds = new Date(assets[assets.length - 1]).getTime() / 1000

  const delta = currentUnixTimeSeconds - latestDataPointUnixTimeSeconds

  expect(delta / 60).toBeLessThanOrEqual(60)
})

window.it('get multiple asset historical data from CoinMarketCap', async () => {
  const response = await CoinMarketCap.getHistoricalAssetData('USD', 'BTC,XRP', 7)

  const assets = Object.keys(response)

  expect(assets.length).toBe(2)

  const bitcoin = response['BTC']

  expect(bitcoin.id).toEqual(1)
  expect(bitcoin.name).toBe('Bitcoin')
  expect(bitcoin.symbol).toBe('BTC')
  expect(bitcoin.quotes.length).toEqual(168)

  const bitcoinCurrentUnixTimeSeconds = new Date().getTime() / 1000
  const bitcoinLatestDataPointUnixTimeSeconds = new Date(bitcoin.quotes[bitcoin.quotes.length - 1].timestamp) / 1000

  const delta = bitcoinCurrentUnixTimeSeconds - bitcoinLatestDataPointUnixTimeSeconds

  expect(delta / 60).toBeLessThanOrEqual(60)

  const xrp = response['XRP']

  expect(xrp.id).toEqual(52)
  expect(xrp.name).toBe('XRP')
  expect(xrp.symbol).toBe('XRP')
  expect(xrp.quotes.length).toEqual(168)

  const xrpCurrentUnixTimeSeconds = new Date().getTime() / 1000
  const xrpLatestDataPointUnixTimeSeconds = new Date(xrp.quotes[xrp.quotes.length - 1].timestamp) / 1000

  const xrpDelta = xrpCurrentUnixTimeSeconds - xrpLatestDataPointUnixTimeSeconds

  expect(xrpDelta / 60).toBeLessThanOrEqual(60)
})