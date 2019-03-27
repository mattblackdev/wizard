import React from 'react'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grow from '@material-ui/core/Grow'

export function Rows(props) {
  return (
    <div>
      <Grid container spacing={24}>
        {props.groups.map((row, rowIndex) => (
          <Grid container item key={rowIndex} xs={12}>
            <Grid item xs="auto" style={{ textAlign: 'right', marginTop: 28 }}>
              <Typography variant="h6">{rowIndex + 1}</Typography>
            </Grid>
            <Grid container item xs>
              {row.map((field, fieldIndex) => {
                return (
                  <Grid
                    item
                    key={fieldIndex}
                    xs
                    fluid
                    style={{ minWidth: 200, margin: '0px 12px' }}>
                    <Grow in timeout={300 + fieldIndex * 500}>
                      {field}
                    </Grow>
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Toolbar>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            props.arrayHelpers.push(props.initialValues)
          }}>
          Add Another
        </Button>
      </Toolbar>
    </div>
  )
}
