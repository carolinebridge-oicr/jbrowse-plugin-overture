import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { AddTrackWorkflowType } from '@jbrowse/core/pluggableElementTypes'
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

  configure(pluginManager: PluginManager) {
    // adds analyses from the configuration on load of the session
    const session = pluginManager.rootModel?.session
    if (session) {
      const plugin = pluginManager.runtimePluginDefinitions.find(
        (plugin: any) => plugin.name === 'Overture',
      )
      // @ts-ignore
      if (plugin?.configurationSchema && plugin?.configurationSchema.analyses) {
        // @ts-ignore
        const analyses = plugin?.configurationSchema.analyses

        analyses.forEach(async (analysis: any) => {
          const configuredAnalysis = await configure(
            analysis,
            analysis.assemblyNames,
            'onLoad',
          )
          Promise.all(configuredAnalysis).then((values) => {
            values.forEach((conf: any) => {
              if (conf) {
                // @ts-ignore
                session.addTrackConf(conf)
              }
            })
          })
        })

        session.notify(
          'Analyses from your configuration have been added as tracks.',
          'success',
        )
      }
    }
  }
}
