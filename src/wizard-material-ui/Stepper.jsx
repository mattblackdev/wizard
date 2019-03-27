import React from 'react'
import MuiStepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'

export function Stepper(props) {
  return (
    <div>
      <MuiStepper alternativeLabel activeStep={props.activeStepIndex}>
        {props.steps.map(step => (
          <Step key={step.name}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </MuiStepper>
    </div>
  )
}
