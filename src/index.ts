import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { AddTrackWorkflowType } from '@jbrowse/core/pluggableElementTypes'
import { getSession, isSessionModelWithWidgets } from '@jbrowse/core/util'
import { configure } from './AnalysisAdapter'

import { version } from '../package.json'
import {
  ReactComponent as AnalysisReactComponent,
  stateModel as analysisStateModel,
} from './AnalysisAddTrackWidget'

export default class OverturePlugin extends Plugin {
  name = 'OverturePlugin'
  version = version

  install(pluginManager: PluginManager) {
    pluginManager.addAddTrackWorkflowType(() => {
      return new AddTrackWorkflowType({
        name: 'Add Overture analysis tracks',
        stateModel: analysisStateModel,
        ReactComponent: AnalysisReactComponent,
      })
    })
  }

  configure() {}
}
