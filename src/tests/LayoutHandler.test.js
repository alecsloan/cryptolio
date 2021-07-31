import React from 'react'
import * as Util from '../Util/index'
import LayoutHandler from '../Components/LayoutHandler'
import { render, screen } from '@testing-library/react'

const asset = {
  "circulating_supply":222295208,
  "cmcId":1817,
  "holdings":"100",
  "imageURL":"https://s2.coinmarketcap.com/static/img/coins/128x128/1817.png",
  "market_cap":561192867.4385666,
  "max_supply":222295209,
  "name":"Voyager Token",
  "percent_change_1h":0.44361563,
  "percent_change_24h":-1.44690034,
  "percent_change_7d":9.05001049,
  "price":2.52453875406332,
  "rank":108,
  "symbol":"VGX",
  "total_supply":222295208.238,
  "url":"https://coinmarketcap.com/currencies/voyager-token",
  "volume_24h":2506623.63393105
}

let settings = {
  balanceChangeTimeframe: 'percent_change_24h',
  currency: 'USD',
  decimals3: 3,
  show1hChange: true,
  show24hChange: true,
  show7dChange: true,
  showAssetBalances: true,
  showPortfolioBalance: true
}

function testCard(div, type) {
  expect(div.querySelector('img').getAttribute("alt")).toBe(asset.name + ' Logo')
  expect(div.querySelector('img').getAttribute("src")).toBe(asset.imageURL)
  expect(div.querySelector('h5').textContent).toBe(`${asset.name} (${asset.symbol})`)
  expect(div.querySelector("[id='1h-change']").textContent).toBe("1h" + Util.getLocalizedPercent(asset.percent_change_1h * .01))
  expect(div.querySelector("[id='24h-change']").textContent).toBe("24h" + Util.getLocalizedPercent(asset.percent_change_24h * .01))
  expect(div.querySelector("[id='7d-change']").textContent).toBe("7d" + Util.getLocalizedPercent(asset.percent_change_7d * .01))
  expect(div.querySelector("[id='balance']").textContent).toBe('Balance:' + Util.getLocalizedPrice(asset.holdings * asset.price, settings))

  let price = Util.getLocalizedPrice(asset.price, settings)
  let marketCap = "$561.19M"

  if (type === 'classic') {
    price = "Price:" + price
    marketCap = "Market Cap:" + marketCap
  }

  expect(div.querySelector("[id='price']").textContent).toBe(price)
  expect(div.querySelector("[id='market-cap']").textContent).toBe(marketCap)
}

function testTable(div) {
  const row = div.querySelector('[data-id="VGX"]')

  expect(row.querySelector('img').getAttribute("alt")).toBe(asset.name + ' Logo')
  expect(row.querySelector('img').getAttribute("src")).toBe(asset.imageURL)
  expect(row.querySelector("[data-field='id']").textContent).toBe(asset.symbol)
  expect(row.querySelector("[data-field='name']").textContent).toBe(asset.name)
  expect(row.querySelector("[data-field='balance']").textContent).toBe(Util.getLocalizedPrice(asset.holdings * asset.price, settings))
  expect(row.querySelector("[data-field='holdings']").textContent).toBe(Util.getLocalizedNumber(asset.holdings, settings))
  expect(row.querySelector("[data-field='price']").textContent).toBe(Util.getLocalizedPrice(asset.price, settings))
  expect(row.querySelector("[data-field='percent_change_1h']").textContent).toBe(Util.getLocalizedPercent(asset.percent_change_1h * .01))
  expect(row.querySelector("[data-field='percent_change_24h']").textContent).toBe(Util.getLocalizedPercent(asset.percent_change_24h * .01))
  expect(row.querySelector("[data-field='percent_change_7d']").textContent).toBe(Util.getLocalizedPercent(asset.percent_change_7d * .01))
  expect(row.querySelector("[data-field='market_cap']").textContent).toBe('$561.19M')
  expect(row.querySelector("[data-field='volume_24h']").textContent).toBe('$2.51M')
  expect(row.querySelector("[data-field='supply']").textContent).toBe('100%')
}

test('Compact AssetCard renders via the LayoutHandler', async () => {
  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      removeCrypto={() => {}}
      renderStyle={"card:classic"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  const cards = document.getElementsByClassName('MuiCard-root')

  expect(cards.length).toBe(1)

  expect(cards[0]).toMatchSnapshot()

  testCard(cards[0], 'classic')
})

test('Compact AssetCard renders via the LayoutHandler', async () => {
  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      removeCrypto={() => {}}
      renderStyle={"card:compact"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  const cards = document.getElementsByClassName('MuiCard-root')

  expect(cards.length).toBe(1)

  expect(cards[0]).toMatchSnapshot()

  testCard(cards[0], 'compact')
})

test('Portfolio Area Stack Chart renders via the LayoutHandler', async () => {
  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      removeCrypto={() => {}}
      renderStyle={"portfolio:chart"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  expect(document.querySelector("canvas")).toMatchSnapshot()

  const cards = document.getElementsByClassName('MuiCard-root')

  expect(cards.length).toBe(1)

  testCard(cards[0], 'classic')
})

test('Portfolio Area Stack Chart with Compact Card sub style renders via the LayoutHandler', async () => {
  settings.renderSubStyle = "card:compact";

  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      removeCrypto={() => {}}
      renderStyle={"portfolio:chart"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  expect(document.querySelector("canvas")).toMatchSnapshot()

  const cards = document.getElementsByClassName('MuiCard-root')

  expect(cards.length).toBe(1)

  testCard(cards[0], 'compact')
})

test('Portfolio Area Stack Chart with Table sub style renders via the LayoutHandler', async () => {
  settings.renderSubStyle = "table";

  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      removeCrypto={() => {}}
      renderStyle={"portfolio:chart"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  expect(document.querySelector("canvas")).toMatchSnapshot()

  expect(document.querySelectorAll("[data-id]").length).toBe(1)

  testTable(document)
})

test('Portfolio Donut Chart renders via the LayoutHandler', async () => {
  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      removeCrypto={() => {}}
      renderStyle={"portfolio:donut"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  expect(document.querySelector("canvas")).toMatchSnapshot()

  expect(document.querySelectorAll("[data-id]").length).toBe(1)

  testTable(document)
})

test('Portfolio Donut Chart with Classic Card sub style renders via the LayoutHandler', async () => {
  settings.renderSubStyle = "card:classic";

  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      removeCrypto={() => {}}
      renderStyle={"portfolio:donut"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  expect(document.querySelector("canvas")).toMatchSnapshot()

  const cards = document.getElementsByClassName('MuiCard-root')

  expect(cards.length).toBe(1)

  testCard(cards[0], 'classic')
})

test('Portfolio Donut Chart with Compact Card sub style renders via the LayoutHandler', async () => {
  settings.renderSubStyle = "card:compact";

  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      removeCrypto={() => {}}
      renderStyle={"portfolio:donut"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  expect(document.querySelector("canvas")).toMatchSnapshot()

  const cards = document.getElementsByClassName('MuiCard-root')

  expect(cards.length).toBe(1)

  testCard(cards[0], 'compact')
})

test('Asset Table renders via the LayoutHandler', async () => {
  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      renderStyle={"table"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  expect(document.querySelectorAll("[data-id]").length).toBe(1)

  expect(document.querySelectorAll("[data-id]").length).toBe(1)

  testTable(document)
})

test('Mobile Asset Table renders via the LayoutHandler', async () => {
  global.innerWidth = 500;

  render(
    <LayoutHandler
      assets={[asset]}
      editSetting={() => {}}
      renderStyle={"table"}
      settings={settings}
      setAssetPanelShown={() => {}}
    />
  )

  const intervalSelector = document.querySelector('[aria-label="percent change"]')

  expect(intervalSelector).toMatchSnapshot()

  expect(document.querySelectorAll("[data-id]").length).toBe(1)

  const row = document.querySelector('[data-id="VGX"]')

  expect(row.querySelector('img').getAttribute("alt")).toBe(asset.name + ' Logo')
  expect(row.querySelector('img').getAttribute("src")).toBe(asset.imageURL)
  expect(screen.getByText(asset.rank))
  expect(screen.getByText(asset.symbol))
  expect(screen.getByText(asset.name))
  expect(screen.getByText(Util.getLocalizedPercent(asset.percent_change_24h * .01)))
  expect(row.querySelector("[data-field='price']").textContent).toBe(Util.getLocalizedPrice(asset.price, settings))
  expect(screen.getByText(Util.getLocalizedPrice(asset.holdings * asset.price, settings)))
  expect(screen.getByText(Util.getLocalizedNumber(asset.holdings, settings) + " " + asset.symbol))
})