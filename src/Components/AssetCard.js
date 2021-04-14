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
import { MyBalance } from '../Util/index'

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
        <Typography className={props.style === 'compact' ? 'd-inline-block m-1' : ''} component='div'>
          <Box className='d-inline-block' fontWeight='fontWeightLight'>
            {props.period}
          </Box>
          <Box className='d-inline-block pl-2' color={hourColor} fontWeight='fontWeightBold'>
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
      settings: props.settings
    }
  }

  render () {
    const renderStyle = this.props.renderStyle.replace('card:', '')

    const price = this.props.asset.price

    const assetImage =
      this.props.asset.imageURL
        ? (
          <img
            alt={this.props.asset.name + ' Logo'}
            height={renderStyle === 'compact' ? 70 : 100}
            src={this.props.asset.imageURL}
          />
          )
        : <Skeleton className='card-img-top m-auto' variant='circle' height={100} />

    const percentChanges =
      (
        <Grid container>
          <Grid item xs={renderStyle === 'compact' ? 4 : 12}><PercentChange period='1h' percentChange={this.props.asset.percent_change_1h} settings={this.props.settings} style={renderStyle} /></Grid>
          <Grid item xs={renderStyle === 'compact' ? 4 : 12}><PercentChange period='24h' percentChange={this.props.asset.percent_change_24h} settings={this.props.settings} style={renderStyle} /></Grid>
          <Grid item xs={renderStyle === 'compact' ? 4 : 12}><PercentChange period='7d' percentChange={this.props.asset.percent_change_7d} settings={this.props.settings} style={renderStyle} /></Grid>
        </Grid>
      )

    const assetInfo =
      price
        ? (
          <div>
            <Grid container>
              {renderStyle === 'compact'
                ? <Grid item xs={6}>{Util.getLocalizedPrice(price, this.props.settings)}</Grid>
                : <Grid item xs={12}>Price: {Util.getLocalizedPrice(price, this.props.settings)}</Grid>}
              {renderStyle === 'compact'
                ? <Grid item xs={6}>{Util.getCurrencySymbol(this.props.settings.currency) + abbreviate(this.props.asset.market_cap, 2, ['K', 'M', 'B', 'T'])}</Grid>
                : <Grid item xs={12}>Market Cap: {Util.getCurrencySymbol(this.props.settings.currency) + abbreviate(this.props.asset.market_cap, 2, ['K', 'M', 'B', 'T'])}</Grid>}
              <Grid item xs={12}><MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} /></Grid>
            </Grid>
            {renderStyle === 'compact' ? percentChanges : null}
          </div>
        )
        : <Skeleton className='m-auto' height={20} width='50%' />

    const assetName =
      (this.props.asset.name && this.props.asset.symbol)
        ? `${this.props.asset.name} (${this.props.asset.symbol})`
        : <Skeleton className='m-auto' height={28} width='50%' />

    return (
      <Card className='card' onClick={() => this.props.setAssetUtilityShown(this.props.asset)}>
        <CardHeader
          avatar={renderStyle === 'compact' ? assetImage : null}
          action={
            <IconButton
              aria-label={this.props.asset.name + ' settings'}
              className='p-0 settings'
              color='inherit'
              onClick={() => this.props.setAssetUtilityShown(this.props.asset)}
            >
              <SettingsIcon />
            </IconButton>
            }
          classes={
            renderStyle === 'compact'
              ? null
              : {
                action: 'm-0 p-2',
                root: 'h-0 p-0'
              }
          }
          subheader={renderStyle === 'compact' ? assetInfo : null}
          title={renderStyle === 'compact' ? <Box component='h5'>{assetName}</Box> : null}
        />
        {
          renderStyle !== 'compact'
            ? (<CardContent>
              <Grid container>
                <Grid item xs={12}>{assetImage}</Grid>
                <Grid item xs={12}>
                  <Typography variant='h5'>{assetName}</Typography>
                </Grid>
              </Grid>
            </CardContent>)
            : null
        }
        <CardContent hidden={renderStyle === 'compact'}>
          <Grid container>
            <Grid item xs={6}>{percentChanges}</Grid>
            <Grid item xs={6}>{assetInfo}</Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

export default AssetCard
