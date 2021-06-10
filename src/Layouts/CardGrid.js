import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Card.css'
import { Grid } from '@material-ui/core'
import AssetCard from '../Components/AssetCard'

function CardGrid (props) {
  const cards = []

  let assets = props.assets

  if (!assets) { return null }

  assets.forEach(asset => {
    cards.push(
      <Grid item xs={12} sm={6} md={4} key={asset.symbol}>
        <AssetCard asset={asset} key={asset.symbol} renderStyle={props.renderStyle || props.settings.renderStyle} settings={props.settings} setAssetPanelShown={props.setAssetPanelShown.bind(this)} />
      </Grid>
    )
  })

  return <Grid container spacing={2}>{cards}</Grid>
}

export default CardGrid
