import * as CoinGecko from '../Util/CoinGecko'

window.it('get available assets from CoinGecko', async () => {
  const assets = await CoinGecko.getAvailableAssets()

  expect(assets.length).toBeGreaterThan(0)

  const bitcoin = assets.find(asset => asset.symbol === 'btc')

  expect(bitcoin.name).toBe('Bitcoin')
  expect(bitcoin.cgId).toBe('bitcoin')

  const xrp = assets.find(asset => !asset.cgId.includes("binance-peg") && asset.symbol === 'xrp')

  expect(xrp.name).toBe('XRP')
  expect(xrp.cgId).toBe('ripple')
})

window.it('get single asset data from CoinGecko', async () => {
  const response = await CoinGecko.getAssetData('USD', 'bitcoin', null)

  const assets = response.assets

  expect(assets.length).toEqual(1)

  const asset = assets[0]

  expect(asset.name).toBe('Bitcoin')
  expect(asset.symbol).toBe('BTC')
  expect(asset.total_supply).toEqual(21000000)
})

window.it('get multiple asset data from CoinGecko', async () => {
  const response = await CoinGecko.getAssetData('USD', 'bitcoin,ripple', null)

  const assets = response.assets

  expect(assets.length).toEqual(2)

  const bitcoin = assets[0]

  expect(bitcoin.name).toBe('Bitcoin')
  expect(bitcoin.symbol).toBe('BTC')
  expect(bitcoin.total_supply).toEqual(21000000)

  const xrp = assets[1]

  expect(xrp.name).toBe('XRP')
  expect(xrp.symbol).toBe('XRP')
  expect(xrp.total_supply).toEqual(100000000000)
})

window.it('get single asset historical data from CoinGecko', async () => {
  const response = await CoinGecko.getHistoricalAssetData('USD', ['bitcoin'], 7)

  expect(response.length).toBe(1)

  const data = response[0]

  expect(data.market_caps.length).toBe(168 || 169)
  expect(data.prices.length).toBe(168 || 169)
  expect(data.total_volumes.length).toBe(168 || 169)

  const currentUnixTimeSeconds = new Date().getTime() / 1000
  const latestDataPointUnixTimeSeconds = data.market_caps[data.prices.length - 1][0] / 1000

  const delta = currentUnixTimeSeconds - latestDataPointUnixTimeSeconds

  expect(delta / 60).toBeLessThanOrEqual(60)
})

window.it('get multiple asset historical data from CoinGecko', async () => {
  const response = await CoinGecko.getHistoricalAssetData('USD', ['bitcoin', 'ripple'], 7)

  expect(response.length).toBe(2)

  const bitcoin = response[0]

  expect(bitcoin.market_caps.length).toBe(168 || 169)
  expect(bitcoin.prices.length).toBe(168 || 169)
  expect(bitcoin.total_volumes.length).toBe(168 || 169)

  const bitcoinCurrentUnixTimeSeconds = new Date().getTime() / 1000
  const bitcoinLatestDataPointUnixTimeSeconds = bitcoin.prices[bitcoin.prices.length - 1][0] / 1000

  const delta = bitcoinCurrentUnixTimeSeconds - bitcoinLatestDataPointUnixTimeSeconds

  expect(delta / 60).toBeLessThanOrEqual(60)

  const xrp = response[0]

  expect(xrp.market_caps.length).toBe(168)
  expect(xrp.prices.length).toBe(168)
  expect(xrp.total_volumes.length).toBe(168)

  const xrpCurrentUnixTimeSeconds = new Date().getTime() / 1000
  const xrpLatestDataPointUnixTimeSeconds = xrp.prices[xrp.prices.length - 1][0] / 1000

  const xrpDelta = xrpCurrentUnixTimeSeconds - xrpLatestDataPointUnixTimeSeconds

  expect(xrpDelta / 60).toBeLessThanOrEqual(60)
})