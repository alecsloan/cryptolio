import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Card.css'
import { Grid } from '@material-ui/core'
import AssetCard from '../Components/AssetCard'
import { ArrowBack, ArrowForward } from '@material-ui/icons'
import IconButton from '@material-ui/core/IconButton'

function MobileAssetCardGallery (props) {
  const [index, setIndex] = React.useState(0)

  function getAssetCard(delta) {
    if (index > 0 && delta === -1) {
      setIndex(index - 1)
    }
    else if (index < props.assets.length -1 && delta === 1) {
      setIndex(index + 1)
    }
  }

  return (
    <div>
      <AssetCard asset={props.assets[index]} key={props.assets[index].symbol} renderStyle={props.renderStyle || "card:compact"} settings={props.settings} setAssetPanelShown={props.setAssetPanelShown.bind(this)} />
      <Grid container>
        <Grid item style={{display: 'flex', justifyContent: 'center'}} xs={6}>
          <IconButton
            aria-label='mode'
            className='p-1 pull-left'
            color='inherit'
            disabled={index === 0}
            onClick={() => getAssetCard(-1)}
            title='Previous'
          >
            <ArrowBack />
          </IconButton>
        </Grid>
        <Grid item style={{display: 'flex', justifyContent: 'center'}} xs={6}>
          <IconButton
            aria-label='mode'
            className='p-1 pull-left'
            color='inherit'
            disabled={index === props.assets.length - 1}
            onClick={() => getAssetCard(1)}
            title='Next'
          >
            <ArrowForward />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}

export default MobileAssetCardGallery
