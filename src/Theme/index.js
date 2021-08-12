import { createTheme } from '@material-ui/core/styles'
import { colors } from '@material-ui/core'

export const dark = createTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#1c2025',
      paper: colors.grey[800]
    },
    primary: {
      main: colors.grey[900]
    },
    secondary: {
      main: colors.red[300]
    }
  }
})

export const light = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: colors.grey[900]
    },
    secondary: {
      main: colors.red[300]
    }
  }
})
