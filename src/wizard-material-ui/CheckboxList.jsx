import React from 'react'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import { fieldToCheckbox } from 'formik-material-ui'

export function CheckboxList(props) {
  function handleChange(option) {
    return event => {
      let newValue = [...props.field.value]
      if (event.target.checked) {
        newValue.push(option.value)
      } else {
        newValue = newValue.filter(val => val !== option.value)
      }
      props.field.onChange({
        target: {
          name: props.field.name,
          value: newValue,
        },
      })
    }
  }
  return (
    <div style={{ marginBottom: 24 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend" style={{ fontWeight: 'bold' }}>
          {props.label}
        </FormLabel>
        <FormGroup>
          {props.options.map(option => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  {...fieldToCheckbox(props)}
                  checked={props.field.value.includes(option.value)}
                  onChange={handleChange(option)}
                  onBlur={props.field.onBlur}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  )
}
