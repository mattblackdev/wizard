import React, { useState } from 'react'
import Link from '@material-ui/core/Link'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'

export function Help(props) {
  const [open, setOpen] = useState(false)
  const buttonText = open ? 'Close' : 'Learn More'
  return (
    <div>
      <Link
        style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
        component="button"
        variant="body2"
        onClick={() => setOpen(!open)}
        type="button">
        {buttonText}
      </Link>
      <Collapse in={open}>
        <Typography style={{ maxWidth: 800 }} gutterBottom>
          {props.value}
        </Typography>
      </Collapse>
    </div>
  )
}
