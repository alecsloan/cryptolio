import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import { TextField } from '@material-ui/core'

function SortSelector (props) {

  return (
    <TextField
      className={window.innerWidth <= 500 ? 'w-100' : 'w-50'}
      onChange={event => props.editSetting('sorting', event.target.value)}
      label='Sort'
      select
      size='small'
      value={props.sorting}
      variant='outlined'
    >
      <MenuItem key='balance' value='balance'>Balance</MenuItem>
      <MenuItem key='market_cap' value='market_cap'>Market Cap</MenuItem>
      <MenuItem key='price' value='price'>Price</MenuItem>
      <MenuItem key='percent_change_1h' value='percent_change_1h'>1 Hour Change</MenuItem>
      <MenuItem key='percent_change_24h' value='percent_change_24h'>24 Hour Change</MenuItem>
      <MenuItem key='percent_change_7d' value='percent_change_7d'>7 Day Change</MenuItem>
    </TextField>
  )
}

export default SortSelector
