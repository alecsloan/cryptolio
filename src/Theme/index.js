import { createMuiTheme } from '@material-ui/core/styles'
import { colors } from '@material-ui/core'

export const dark = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#1c2025',
      paper: colors.grey[800]
    },
    primary: {
      main: colors.grey[900]
    }
  }
})

export const light = createMuiTheme({
  palette: {
    type: 'light'
  }
})
