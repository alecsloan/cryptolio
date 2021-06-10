import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import { TextField } from '@material-ui/core'

function TimeframeSelector (props) {

  return (
    <TextField
      className={window.innerWidth <= 500 ? 'w-100' : 'w-50'}
      onChange={event => props.editSetting('balanceChangeTimeframe', event.target.value)}
      label='Timeframe'
      select
      size='small'
      value={props.balanceChangeTimeframe || 'percent_change_7d'}
      variant='outlined'
    >
      <MenuItem key='percent_change_24h' value='percent_change_24h'>24 Hour</MenuItem>
      <MenuItem key='percent_change_7d' value='percent_change_7d'>7 Day</MenuItem>
      <MenuItem key='percent_change_14d' value='percent_change_14d'>14 Day</MenuItem>
      <MenuItem key='percent_change_30d' value='percent_change_30d'>30 Day</MenuItem>
      <MenuItem key='percent_change_60d' value='percent_change_60d'>60 Day</MenuItem>
      <MenuItem key='percent_change_90d' value='percent_change_90d'>90 Day</MenuItem>
      <MenuItem key='percent_change_120d' value='percent_change_120d'>120 Day</MenuItem>
      <MenuItem key='percent_change_365d' value='percent_change_365d'>1 Year</MenuItem>
    </TextField>
  )
}

export default TimeframeSelector
