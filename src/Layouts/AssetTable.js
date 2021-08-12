import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Card.css'
import { Box, CircularProgress, colors, IconButton, Typography } from '@material-ui/core'
import * as Util from '../Util'
import abbreviate from 'number-abbreviate'
import { DataGrid } from '@material-ui/data-grid'
import { Delete } from '@material-ui/icons'
import MobileAssetTable from './MobileAssetTable'

function AssetTable (props) {
  if (window.innerWidth <= 500) {
    return <MobileAssetTable {...props} />
  }

  let assets = props.assets

  const columns = [
    {
      field: 'imageURL',
      headerName: ' ',
      renderCell: (params) => (
        <img alt={params.row.name + " Logo"} height={28} src={params.value} />
      ),
      width: 60
    },
    { field: 'id', headerName: 'Symbol', width: 110 },
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'balance',
      headerName: 'Balance',
      hide: !props.settings.showAssetBalances,
      width: 150,
      renderCell: (params) => (
        Util.getLocalizedPrice(params.value, props.settings)
      )
    },
    {
      field: 'holdings',
      headerName: 'Holdings',
      hide: !props.settings.showAssetBalances,
      renderCell: (params) => (
          Number(params.value) > 0 ? Util.getLocalizedNumber(Number(params.value), props.settings) : ' '
      ),
      width: 120
    },
    {
      field: 'price',
      headerName: 'Price',
      renderCell: (params) => (
        Util.getLocalizedPrice(params.value, props.settings)
      )
    },
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
    {
      field: 'market_cap',
      headerName: 'Market Cap',
      width: 140,
      renderCell: (params) => (
        Util.getCurrencySymbol(props.settings.currency) + abbreviate(params.value, 2, ['K', 'M', 'B', 'T'])
      )
    },
    {
      field: 'volume_24h',
      headerName: 'Volume',
      width: 110,
      renderCell: (params) => (
        Util.getCurrencySymbol(props.settings.currency) + abbreviate(params.value, 2, ['K', 'M', 'B', 'T'])
      )
    },
    {
      description: "Calculated by (Circulating Supply / Max Supply). However if Max Supply is not specified it is replaced by Total Supply",
      field: 'supply',
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
      width: 106
    },
    {
      field: "removeSymbol",
      headerName: ' ',
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
      width: 60
    }
  ]

  columns.forEach(column => {
    column.sortable = false
  })

  function createData(id, imageURL, name, balance, holdings, price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap, volume_24h, supply, removeSymbol) {
    return { id, imageURL, name, balance, holdings, price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap, volume_24h, supply, removeSymbol };
  }

  const rows = []

  assets.forEach((asset) => {
    rows.push(
      createData(
        asset.symbol,
        asset.imageURL,
        asset.name,
        asset.holdings * asset.price,
        asset.holdings,
        asset.price,
        asset.percent_change_1h,
        asset.percent_change_24h,
        asset.percent_change_7d,
        asset.market_cap,
        asset.volume_24h,
        (asset.circulating_supply / (asset.max_supply || asset.total_supply)),
        asset.symbol
      )
    );
  })

  return (
    <DataGrid
      autoHeight
      className="m-2"
      columns={columns}
      columnBuffer={columns.length}
      disableColumnFilter={true}
      disableColumnMenu={true}
      hideFooterSelectedRowCount={true}
      onCellClick = {(cell) => {
        if(cell.field !== "removeSymbol") {
          const asset = assets.find(asset => asset.symbol === cell.row.id)

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
  );
}

export default AssetTable
