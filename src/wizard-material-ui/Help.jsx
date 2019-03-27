import React, { useState } from 'react'
import Link from '@material-ui/core/Link'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'

export function Help(props) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: 16 }}>
      <Link
        style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
        component="button"
        variant="body2"
        onClick={() => setOpen(!open)}
        type="button"
        color="secondary">
        {open ? 'Close' : 'Learn More'}
      </Link>
      <Collapse in={open} component="div">
        <Typography variant="body1" style={{ maxWidth: 800 }}>
          {props.value}
        </Typography>
      </Collapse>
    </div>
  )
}
