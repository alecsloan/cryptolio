import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Card.css'
import { Box, colors, Grid, TextField } from '@material-ui/core'
import * as Util from '../Util/index'
import { DataGrid } from '@material-ui/data-grid'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import MenuItem from '@material-ui/core/MenuItem'

function MobileAssetTable (props) {
  let assets = props.assets

  const columns = [
    {
      field: 'name',
      flex: 1,
      headerName: 'Name',
      disableColumnMenu: false,
      renderCell: (params) => (
        <Grid container>
          <Grid item style={{lineHeight: 'normal', }} xs={3}>
            <img alt="Logo" height={20} src={params.row.imageURL} />
          </Grid>
          <Grid
            item
            style={{
              lineHeight: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            xs={9}
          >
            {params.value}
          </Grid>
          <Grid item style={{lineHeight: 'normal'}} xs={3}><small>{params.row.rank}</small></Grid>
          <Grid item style={{lineHeight: 'normal'}} xs={4}><small>{params.row.id}</small></Grid>
          <Grid item style={{lineHeight: 'normal'}} xs={5}>
            <small>
              <Box color={String(params.row[props.settings.balanceChangeTimeframe]).includes('-') ? colors.red[300] : colors.green[300]}>
                {Util.getLocalizedPercent(params.row[props.settings.balanceChangeTimeframe] * .01)}
              </Box>
            </small>
          </Grid>
        </Grid>
      )
    },
    {
      field: 'price',
      flex: .5,
      headerName: 'Price',
      renderCell: (params) => (
        Util.getLocalizedPrice(params.value, props.settings)
      )
    },
    {
      field: 'balance',
      flex: .7,
      headerName: 'Balance',
      hide: !props.settings.showAssetBalances,
      renderCell: (params) => (
        <Grid container>
          <Grid item style={{lineHeight: 'normal', textAlign: 'right'}} xs={12}>{Util.getLocalizedPrice(params.value, props.settings)}</Grid>
          <Grid item style={{lineHeight: 'normal', textAlign: 'right'}} xs={12}><small>{Util.getLocalizedNumber(Number(params.row.holdings), props.settings) || 0} {params.row.id}</small></Grid>
        </Grid>
      )
    },
    { field: 'market_cap', hide: true },
    { field: 'percent_change_1h', hide: true },
    { field: 'percent_change_24h', hide: true },
    { field: 'percent_change_7d', hide: true },
  ]

  function createData(id, rank, imageURL, name, balance, holdings, price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap) {
    return { id, rank, imageURL, name, balance, holdings, price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap };
  }

  const rows = []

  assets.forEach((asset) => {
    rows.push(
      createData(
        asset.symbol,
        asset.rank,
        asset.imageURL,
        asset.name,
        asset.holdings * asset.price,
        asset.holdings,
        asset.price,
        asset.percent_change_1h,
        asset.percent_change_24h,
        asset.percent_change_7d,
        asset.market_cap
      )
    );
  })

  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <ToggleButtonGroup
            aria-label="percent change"
            className="mb-2"
            exclusive
            onChange={
              (event, value) => {
                if (props.settings.sorting.includes('percent_change')) {
                  props.editSetting('sorting', value)
                }

                if (value) {
                  props.editSetting('balanceChangeTimeframe', value);
                }
              }
            }
            value={props.settings.balanceChangeTimeframe}
          >
            <ToggleButton value="percent_change_1h" aria-label="1h percent change">
              1h
            </ToggleButton>
            <ToggleButton value="percent_change_24h" aria-label="24h percent change">
              24h
            </ToggleButton>
            <ToggleButton value="percent_change_7d" aria-label="7d percent change">
              7d
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={6}>
          <TextField
            className='w-100'
            onChange={event => props.editSetting('sorting', event.target.value)}
            label='Sort'
            select
            size='small'
            value={props.settings.sorting}
            variant='outlined'
          >
            <MenuItem key='balance' value='balance'>Balance</MenuItem>
            <MenuItem key='market_cap' value='market_cap'>Market Cap</MenuItem>
            <MenuItem key='price' value='price'>Price</MenuItem>
            <MenuItem key={props.settings.balanceChangeTimeframe} value={props.settings.balanceChangeTimeframe}>% Change</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <DataGrid
        autoHeight
        columns={columns}
        disableColumnMenu
        hideFooterSelectedRowCount
        onRowClick={(params) => {
          const asset = assets.find(asset => asset.symbol === params.row.id)

          if (asset) {
            return props.setAssetPanelShown(asset)
          }
        }}
        pageSize={20}
        rows={rows}
        sortModel={[
          {
            field: props.settings.sorting || 'balance',
            sort: 'desc',
          },
        ]}
      />
    </div>
  );
}

export default MobileAssetTable
