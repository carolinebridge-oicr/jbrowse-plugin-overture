import { ElementId } from '@jbrowse/core/util/types/mst'
import { types } from 'mobx-state-tree'

const stateModel = types
  .model({
    id: ElementId,
    type: types.literal('AnalysisAddTrackWidget'),
  })
  .actions((self) => ({
    // unused but required by your view
    setWidth() {},
  }))

export default stateModel
