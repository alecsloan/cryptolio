import React from 'react'
import CardGrid from '../Layouts/CardGrid'
import AssetTable from '../Layouts/AssetTable'
import PortfolioAreaStackChart from './PortfolioAreaStackChart'
import PortfolioDonutChart from './PortfolioDonutChart'

function LayoutHandler (props) {
  let assets = props.assets

  if (props.settings.sorting === 'price') {
    assets = assets.sort((a, b) => b.price - a.price)
  } else if (props.settings.sorting === 'market_cap') {
    assets = assets.sort((a, b) => b.market_cap - a.market_cap)
  } else if (props.settings.sorting === 'percent_change_1h') {
    assets = assets.sort((a, b) => b.percent_change_1h - a.percent_change_1h)
  } else if (props.settings.sorting === 'percent_change_24h') {
    assets = assets.sort((a, b) => b.percent_change_24h - a.percent_change_24h)
  } else if (props.settings.sorting === 'percent_change_7d') {
    assets = assets.sort((a, b) => b.percent_change_7d - a.percent_change_7d)
  } else {
    assets = assets.sort((a, b) => ((b.holdings || 0.000001) * b.price) - ((a.holdings || 0.000001) * a.price))
  }

  switch (props.renderStyle || props.settings.renderStyle) {
    case "card:classic":
    case "card:compact":
      return <CardGrid assets={assets} renderStyle={props.renderStyle || props.settings.renderStyle} settings={props.settings} setAssetPanelShown={props.setAssetPanelShown.bind(this)} />
    case "portfolio:chart":
      return <PortfolioAreaStackChart assets={assets} editSetting={props.editSetting.bind(this)} settings={props.settings} setAssetPanelShown={props.setAssetPanelShown.bind(this)} />
    case "portfolio:donut":
      return <PortfolioDonutChart assets={assets} editSetting={props.editSetting.bind(this)} settings={props.settings} setAssetPanelShown={props.setAssetPanelShown.bind(this)} />
    case "table":
    default:
      return <AssetTable assets={assets} editSetting={props.editSetting.bind(this)} settings={props.settings} setAssetPanelShown={props.setAssetPanelShown.bind(this)} />
  }
}

export default LayoutHandler
