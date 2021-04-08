import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Card.css'
import { Box, CircularProgress, colors, IconButton, Typography } from '@material-ui/core'
import * as Util from '../Util/index'
import abbreviate from 'number-abbreviate'
import { DataGrid } from '@material-ui/data-grid'
import { Delete } from '@material-ui/icons'

function AssetTable (props) {
  let assets = props.assets

  if (props.settings.sorting === 'price') {
    assets = assets.sort((a, b) => b.price - a.price)
  } else if (props.settings.sorting === 'marketcap') {
    assets = assets.sort((a, b) => b.market_cap - a.market_cap)
  } else if (props.settings.sorting === '1h') {
    assets = assets.sort((a, b) => b.percent_change_1h - a.percent_change_1h)
  } else if (props.settings.sorting === '24h') {
    assets = assets.sort((a, b) => b.percent_change_24h - a.percent_change_24h)
  } else if (props.settings.sorting === '7d') {
    assets = assets.sort((a, b) => b.percent_change_7d - a.percent_change_7d)
  } else {
    assets = assets.sort((a, b) => ((b.holdings || 0.000001) * b.price) - ((a.holdings || 0.000001) * a.price))
  }

  const columns = [
    {
      field: 'imageURL',
      filterable: false,
      headerName: 'Logo',
      renderCell: (params) => (
        <img alt="Logo" height={28} src={params.value} />
      ),
      sortable: false,
      width: 60
    },
    { field: 'id', headerName: 'Symbol', width: 110 },
    { field: 'name', headerName: 'Name', width: 120 },
    { field: 'balance', headerName: 'Balance', hide: !props.settings.showCardBalances, width: 120 },
    { field: 'price', headerName: 'Price' },
    {
      field: 'percent_change_1h',
      headerName: '1h',
      hide: !props.settings.show1hChange,
      width: 80,
      renderCell: (params) => (
        <Box color={String(params.value).includes('-') ? colors.red[300] : colors.green[300]}>
          {Util.getLocalizedPercent(params.value * .01)}
        </Box>
      )
    },
    {
      field: 'percent_change_24h',
      headerName: '24h',
      hide: !props.settings.show24hChange,
      width: 90,
      renderCell: (params) => (
        <Box color={String(params.value).includes('-') ? colors.red[300] : colors.green[300]}>
          {Util.getLocalizedPercent(params.value * .01)}
        </Box>
      )
    },
    {
      field: 'percent_change_7d',
      headerName: '7d',
      hide: !props.settings.show7dChange,
      width: 80,
      renderCell: (params) => (
        <Box color={String(params.value).includes('-') ? colors.red[300] : colors.green[300]}>
          {Util.getLocalizedPercent(params.value * .01)}
        </Box>
      )
    },
    { field: 'market_cap', headerName: 'Market Cap', width: 140 },
    { field: 'volume_24h', headerName: 'Volume', width: 110 },
    {
      description: "Calculated by (Circulating Supply / Max Supply). However if Max Supply is not specified it is replaced by Total Supply",
      field: 'supply',
      filterable: false,
      headerName: 'Supply',
      renderCell: (params) => (
        <Box position="relative" display="inline-flex">
          <CircularProgress color='secondary' value={params.value * 100} variant="determinate" />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" component="div" color="textSecondary">
              {`${Util.getLocalizedPercent(params.value, 0)}`}
            </Typography>
          </Box>
        </Box>
      ),
      sortable: false,
      width: 106
    },
    {
      field: "removeSymbol",
      filterable: false,
      headerName: " ",
      renderCell: (params) => (
        <IconButton
          aria-label='close'
          className="p-0"
          color='inherit'
          onClick={() => props.removeCrypto(params.value)}
          style={{
            marginLeft: -5
          }}
        >
          <Delete />
        </IconButton>
      ),
      sortable: false,
      width: 60
    }
  ]

  function createData(id, imageURL, name, balance, price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap, volume_24h, supply, removeSymbol) {
    return { id, imageURL, name, price, balance, percent_change_1h, percent_change_24h, percent_change_7d, market_cap, volume_24h, supply, removeSymbol };
  }

  const rows = []

  assets.forEach((asset) => {
    rows.push(
      createData(
        asset.symbol,
        asset.imageURL,
        asset.name,
        Util.getLocalizedPrice(asset.holdings * asset.price, props.settings),
        Util.getLocalizedPrice(asset.price, props.settings),
        asset.percent_change_1h,
        asset.percent_change_24h,
        asset.percent_change_7d,
        Util.getCurrencySymbol(props.settings.currency) + abbreviate(asset.market_cap, 2, ['K', 'M', 'B', 'T']),
        Util.getCurrencySymbol(props.settings.currency) + abbreviate(asset.volume_24h, 2, ['K', 'M', 'B', 'T']),
        (asset.circulating_supply / (asset.max_supply || asset.total_supply)),
        asset.symbol
      )
    );
  })

  return (
    <DataGrid
      autoHeight
      columns={columns}
      onSelectionModelChange={(row) => {
        const asset = assets.find(asset => asset.symbol === row.selectionModel[0])

        return props.setAssetUtilityShown(asset)
      }}
      pageSize={20} rows={rows} />
  );
}

export default AssetTable
