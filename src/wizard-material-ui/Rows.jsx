import React from 'react'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

export function Rows(props) {
  return (
    <div>
      <Grid container>
        {props.groups.map((row, rowIndex) => (
          <Grid item key={rowIndex} xs={12}>
            <Grid container spacing={8} alignItems="center">
              <Grid item>
                <Typography variant="display2">{rowIndex + 1}</Typography>
              </Grid>
              {row.map((field, fieldIndex) => {
                const size = 12
                return (
                  <Grid item key={fieldIndex} fluid>
                    {field}
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
          onClick={() => {
            props.arrayHelpers.push(props.initialValues)
          }}>
          Add
        </Button>
      </Toolbar>
    </div>
  )
}
