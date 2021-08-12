import { Box, Typography } from '@material-ui/core'
import React from 'react'

export function getCurrencySymbol (currency) {
  return (0).toLocaleString(
    window.navigator.language,
    {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }
  ).replace(/\d/g, '').trim()
}

export function getLocalizedNumber (number, settings) {
  return getLocalizedPrice(number, settings, 'decimal')
}

export function getLocalizedPrice (price, settings, style = 'currency') {
  if (!price || !settings) {
    return ''
  }

  let maxDigits = 0

  if (settings.decimals4 && price < settings.decimals4) {
    maxDigits = 4
  } else if (settings.decimals3 && price < settings.decimals3) {
    maxDigits = 3
  } else if (settings.decimals2 && price < settings.decimals2) {
    maxDigits = 2
  }

  return price.toLocaleString(
    window.navigator.language,
    {
      currency: settings.currency,
      maximumFractionDigits: maxDigits,
      minimumFractionDigits: maxDigits,
      style: style
    }
  )
}

export function getLocalizedPercent (number, minimumFractionDigits = 2) {
  return number.toLocaleString(window.navigator.language, { style: 'percent', minimumFractionDigits: minimumFractionDigits })
}

export function MyBalance (props) {
  if (props.holdings > 0 && props.settings.showAssetBalances) {
    return (
      <Typography component='div' id='balance'>
        <Box className='d-inline-block me-1' fontWeight='fontWeightBold'>
          Balance:
        </Box>
        <Box className='d-inline-block pl-2' fontWeight='fontWeightBold'>
          {getLocalizedPrice(props.price * props.holdings, props.settings)}
        </Box>
      </Typography>
    )
  }

  return (
    <div />
  )
}
