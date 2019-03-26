import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { fieldToTextField } from 'formik-material-ui'

const defaultProps = {
  margin: 'normal',
  style: { minWidth: 200, marginRight: 32 },
}

export function Select(props) {
  return (
    <TextField
      select
      {...Object.assign({}, defaultProps, fieldToTextField(props))}>
      {props.options.map(option => (
        <MenuItem value={option.value} key={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
