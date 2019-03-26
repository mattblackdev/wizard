import React from 'react'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

export default function ThemeProvider({ children }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
