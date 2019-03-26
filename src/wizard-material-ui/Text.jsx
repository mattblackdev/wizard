import React from 'react'
import TextField from '@material-ui/core/TextField'
import { fieldToTextField } from 'formik-material-ui'

const defaultProps = {
  margin: 'normal',
  style: { minWidth: 200, marginRight: 32 },
}

export function Text(props) {
  return (
    <TextField {...Object.assign({}, defaultProps, fieldToTextField(props))} />
  )
}
