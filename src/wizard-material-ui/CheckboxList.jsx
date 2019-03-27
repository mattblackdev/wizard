import React from 'react'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { fieldToCheckbox } from 'formik-material-ui'

const defaultProps = {
  color: 'primary',
}

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
    <div style={{ margin: '24px 0px' }}>
      <FormControl component="fieldset">
        <FormLabel component="legend" style={{ marginBottom: 8 }}>
          {props.label}
        </FormLabel>
        <FormGroup>
          {props.options.map(option => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  {...Object.assign({}, defaultProps, fieldToCheckbox(props))}
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
