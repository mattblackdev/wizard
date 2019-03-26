import React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { fieldToRadioGroup } from 'formik-material-ui'
import { FormLabel } from '@material-ui/core'

const defaultProps = {}

export function YesNoRadio(props) {
  const radioGroupProps = fieldToRadioGroup(
    Object.assign({}, defaultProps, props),
  )
  return (
    <div style={{ marginBottom: 24 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend" style={{ fontWeight: 'bold' }}>
          {props.label}
        </FormLabel>
        <RadioGroup {...radioGroupProps}>
          <FormControlLabel
            value="no"
            control={<Radio color="primary" />}
            label="No"
          />
          <FormControlLabel
            value="yes"
            control={<Radio color="primary" />}
            label="Yes"
          />
        </RadioGroup>
      </FormControl>
    </div>
  )
}
