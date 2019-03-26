import React from 'react'
import Button from '@material-ui/core/Button'

export function SubmitButton(props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '16px 32px',
      }}>
      <Button variant="contained" color="primary" {...props} />
    </div>
  )
}
