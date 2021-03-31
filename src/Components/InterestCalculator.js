import React from 'react'
import { InputAdornment, TextField } from '@material-ui/core'
import * as Util from '../Util/index'
import { DataGrid } from '@material-ui/data-grid'

function InterestCalculator (props) {
  const columns = [
    { field: 'id', headerName: props.asset.symbol + ' Earned', width: '33%', sortable: false },
    { field: 'amount', headerName: 'Amount', width: '33%', sortable: false },
    { field: 'value', headerName: Util.getCurrencySymbol(props.settings.currency) + ' Value', width: '33%', sortable: false }
  ]

  const price = props.price || props.asset.price
  const yearlyInterest = props.asset.holdings * (props.asset.interest * 0.01)

  const rows = [
    { id: 'Daily', amount: Util.getLocalizedNumber(yearlyInterest / 365, props.settings) || 0, value: Util.getLocalizedPrice(price * (yearlyInterest / 365) || 0, props.settings) },
    { id: 'Weekly', amount: Util.getLocalizedNumber(yearlyInterest / 52, props.settings) || 0, value: Util.getLocalizedPrice(price * (yearlyInterest / 52) || 0, props.settings) },
    { id: 'Monthly', amount: Util.getLocalizedNumber(yearlyInterest / 12, props.settings) || 0, value: Util.getLocalizedPrice(price * (yearlyInterest / 12) || 0, props.settings) },
    { id: 'Yearly', amount: Util.getLocalizedNumber(yearlyInterest, props.settings) || 0, value: Util.getLocalizedPrice(price * yearlyInterest || 0, props.settings) }
  ]

  return (
    <div>
      <TextField
        InputProps={{
          endAdornment: <InputAdornment position='end'>%</InputAdornment>
        }}
        label='Interest'
        onChange={
          event => {
            props.updateInterest(event.target.value, props.asset.symbol)
          }
        }
        size='small'
        value={props.asset.interest}
        variant='outlined'
      />

      <DataGrid autoHeight className='m-auto' columns={columns} disableColumnMenu disableColumnReorder hideFooter rows={rows} />
    </div>
  )
}

export default InterestCalculator
