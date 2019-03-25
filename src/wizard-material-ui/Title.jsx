import React from 'react'
import Typography from '@material-ui/core/Typography'

export function Title(props) {
  return (
    <Typography variant="h4" gutterBottom>
      {props.value}
    </Typography>
  )
}
