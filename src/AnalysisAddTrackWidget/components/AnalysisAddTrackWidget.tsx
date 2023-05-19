import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from 'tss-react/mui'
import { Button, Paper, TextField, Typography } from '@mui/material'
import { ErrorMessage } from '@jbrowse/core/ui'
import { getSession } from '@jbrowse/core/util'

import { configure } from '../../AnalysisAdapter'

const useStyles = makeStyles()((theme) => ({
  textbox: {
    width: '100%',
  },
  paper: {
    margin: theme.spacing(),
    padding: theme.spacing(),
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
  },
  submit: {
    marginBottom: 20,
    width: '50%',
  },
}))

const AnalysisAddTrackWidget = observer(({ model }: { model: any }) => {
  const { classes } = useStyles()
  const [val, setVal] = useState('')
  const [error, setError] = useState<unknown>()

  return (
    <Paper className={classes.paper}>
      <Typography variant="body1">
        Paste your configuration for your analysis/analyses:
      </Typography>
      <TextField
        multiline
        rows={11}
        value={val}
        onChange={(event) => setVal(event.target.value)}
        placeholder={
          '{\n\t"analyses": [\n\t\t{\n\t\t\t"songURL": "https://song-url.bio/v2/api",\n\t\t\t"scoreURL": "https://score-url.bio/v2/api",\n\t\t\t"authToken": "abcd1234",\n\t\t\t"studyId": "SOME-ID",\n\t\t\t"analysisId": "1234abcD"  \n\t\t}\n\t]\n}'
        }
        variant="outlined"
        className={classes.textbox}
      />
      {error ? <ErrorMessage error={error} /> : null}
      <Button
        variant="contained"
        className={classes.submit}
        onClick={() => {
          try {
            setError(undefined)
            const session = getSession(model)
            const analyses = JSON.parse(val).analyses
            analyses.forEach(async (analysis: any) => {
              const configuredAnalysis = await configure(
                analysis,
                model.view.assemblyNames,
              )
              Promise.all(configuredAnalysis).then((values) => {
                values.forEach((conf: any) => {
                  if (conf) {
                    session.addTrackConf(conf)
                    model.view.showTrack(conf.trackId)
                  }
                })
              })
            })
            session.notify(
              'Your analyses have been added to tracks for the present view.',
              'success',
            )
            session.hideWidget(model)
          } catch (e) {
            setError(e)
          }
        }}
      >
        Submit
      </Button>
    </Paper>
  )
})

export default AnalysisAddTrackWidget
