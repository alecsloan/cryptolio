import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Card.css'
import TextField from '@material-ui/core/TextField'
import { Box, Card, CardContent, CardHeader, colors, Grid, IconButton, Typography } from '@material-ui/core'
import { BarChart, Delete, Save, Settings as SettingsIcon } from '@material-ui/icons'
import Button from '@material-ui/core/Button'
import * as Util from '../Util/index'
import { Skeleton } from '@material-ui/lab'
import abbreviate from 'number-abbreviate'

function MyBalance (props) {
  if (props.holdings > 0 && props.settings.showCardBalances) {
    return (
      <div className='mt-2'>
        My Balance: {Util.getLocalizedPrice(props.price * props.holdings, props.settings)}
      </div>
    )
  }

  return (
    <div />
  )
}

function PercentChange (props) {
  let showPeriodChange = false

  if (props.period === '1h') {
    showPeriodChange = props.settings.show1hChange
  } else if (props.period === '24h') {
    showPeriodChange = props.settings.show24hChange
  } else if (props.period === '7d') {
    showPeriodChange = props.settings.show7dChange
  }

  if (showPeriodChange) {
    const hourColor = String(props.percentChange).includes('-') ? colors.red[300] : colors.green[300]

    const percent = <span>{Util.getLocalizedPercent(props.percentChange * 0.01)}</span>

    return (props.percentChange)
      ? (
        <Typography className="d-inline-block m-1" component="div">
          <Box className="d-inline-block" fontWeight="fontWeightLight">
            {props.period}
          </Box>
          <Box className="d-inline-block" color={hourColor} fontWeight="fontWeightBold" p={1}>
            {percent}
          </Box>
        </Typography>
        )
      : <Skeleton className='m-auto' height={20} width='50%' />
  }

  return null
}

class AssetCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      flip: false,
      settings: props.settings
    }
  }

  toggleSettings () {
    this.setState({ flip: !this.state.flip })
  }

  render () {
    const price = this.props.asset.price

    return (
      <Card className='card' onClick={(event) => (window.innerWidth <= 760 && event.target.tagName !== "INPUT") ? this.toggleSettings() : null}>
        <CardHeader
          avatar={
            this.props.asset.imageURL
              ? <img
                alt={this.props.asset.name + ' Logo'}
                height={75}
                src={this.props.asset.imageURL}
              />
              : <Skeleton className='card-img-top m-auto' variant='circle' height={100} />
          }
          action={
            this.state.flip ?
              <IconButton
                aria-label={'save ' + this.props.asset.name}
                className='p-0 settings visible'
                color='inherit'
                onClick={() => this.toggleSettings()}
              >
                <Save />
              </IconButton>
              :
              <IconButton
                aria-label={this.props.asset.name + ' settings'}
                className='p-0 settings'
                color='inherit'
                onClick={() => this.toggleSettings()}
              >
                <SettingsIcon />
              </IconButton>
          }
          subheader={
            price
              ? <Grid container>
                <Grid item xs={6}>{Util.getLocalizedPrice(price, this.props.settings)}</Grid>
                <Grid item xs={6}>{Util.getCurrencySymbol(this.props.settings.currency) + abbreviate(this.props.asset.market_cap, 2, ['K', 'M', 'B', 'T'])}</Grid>
                <Grid item xs={12}><MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} /></Grid>
              </Grid>
              : <Skeleton className='m-auto' height={20} width='50%' />}
          title={(this.props.asset.name && this.props.asset.symbol)
            ? `${this.props.asset.name} (${this.props.asset.symbol})`
            : <Skeleton className='m-auto' height={28} width='50%' />}
        />
        <CardContent className="p-0" hidden={this.state.flip}>
          <PercentChange period='1h' percentChange={this.props.asset.percent_change_1h} settings={this.props.settings} />
          <PercentChange period='24h' percentChange={this.props.asset.percent_change_24h} settings={this.props.settings} />
          <PercentChange period='7d' percentChange={this.props.asset.percent_change_7d} settings={this.props.settings} />
        </CardContent>
        <CardContent hidden={!this.state.flip}>
          <TextField
            label='My Holdings'
            onChange={
              event => {
                this.props.updateHoldings(event.target.value, this.props.asset.symbol)
              }
            }
            size='small'
            value={Util.getLocalizedNumber(this.props.asset.holdings, this.props.settings)}
            variant='outlined'
          />

          <MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} />

          <hr />

          <Button
            variant='contained'
            className='mb-2'
            color='primary'
            startIcon={<BarChart />}
            onClick={() => this.props.setAssetUtilityShown(this.props.asset)}
          >
            Simulation and more
          </Button>

          <Button
            variant='contained'
            className='mb-2'
            color='secondary'
            startIcon={<Delete />}
            onClick={() => this.props.removeCrypto(this.props.asset.symbol)}
          >
            Remove Asset
          </Button>
        </CardContent>
      </Card>
    )
  }
}

export default AssetCard
