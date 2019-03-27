import React from 'react'
import Fab from '@material-ui/core/Fab'
import Grow from '@material-ui/core/Grow'
import ContinueIcon from '@material-ui/icons/ForwardSharp'
import FinishIcon from '@material-ui/icons/Done'

const defaultProps = {
  variant: 'extended',
  color: 'primary',
}

export function SubmitButton({ isLastStep, ...props }) {
  const buttonProps = Object.assign({}, defaultProps, props)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '16px',
      }}>
      <Grow in={isLastStep} mountOnEnter>
        <Fab size="large" {...buttonProps}>
          <FinishIcon style={{ marginRight: 4 }} /> Finish
        </Fab>
      </Grow>
      <Grow in={!isLastStep} unmountOnExit timeout={1500}>
        <Fab {...buttonProps}>
          Continue <ContinueIcon style={{ marginLeft: 8 }} />
        </Fab>
      </Grow>
    </div>
  )
}
