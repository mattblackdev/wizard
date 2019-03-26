import React from 'react'
import Typography from '@material-ui/core/Typography'

const defaultProps = {
  style: {
    marginTop: 16,
    marginBottom: 32,
  },
  variant: 'h4',
}

export function Title(props) {
  return (
    <Typography {...Object.assign({}, defaultProps, props)}>
      {props.value}
    </Typography>
  )
}
