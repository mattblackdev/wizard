import React, { Fragment, useState } from 'react'
import Link from '@material-ui/core/Link'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'

export function Help(props) {
  const [open, setOpen] = useState(false)
  return (
    <Fragment>
      <Link
        style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
        component="button"
        variant="body2"
        onClick={() => setOpen(!open)}
        type="button"
        color="primary">
        {open ? 'Close' : 'Learn More'}
      </Link>
      <Collapse in={open} component="div">
        <Typography style={{ maxWidth: 800 }} gutterBottom>
          {props.value}
        </Typography>
      </Collapse>
    </Fragment>
  )
}
