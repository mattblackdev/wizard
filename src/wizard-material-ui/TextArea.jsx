import React from 'react'
import MuiTextField from '@material-ui/core/TextField'
import { fieldToTextField } from 'formik-material-ui'

const defaultProps = {
  multiline: true,
  rows: 6,
  fullWidth: true,
  margin: 'normal',
  variant: 'outlined',
}

export function TextArea(props) {
  return (
    <MuiTextField
      {...fieldToTextField(Object.assign({}, defaultProps, props))}
    />
  )
}
