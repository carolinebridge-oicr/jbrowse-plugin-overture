![Integration](git@github.com:carolinebridge-oicr/jbrowse-plugin-overture/workflows/Integration/badge.svg?branch=main)

# jbrowse-plugin-overture

> JBrowse 2 plugin for connection to Overture instance resources.

## Config

Analyses are configured within the Overture Plugin via the following schema for "analyses". This object can be passed either through the "configurationSchema" slot in the JBrowse config, or pasted into the corresponding text field within the "Add Overture analyses tracks" workflow.

`analyses` is an array such that you can pass multiple analyses into it to view in JBrowse as tracks.

```json
{
  "analyses": [
    {
      "songUrl": "https://some.url.org/v2/api",
      "scoreUrl": "https://some.other.url.org/v2/api",
      "authToken": "abcd1234",
      "studyId": "TEST-ST",
      "analysisId": "some-matching-analysis-id",
      "assemblyNames": ["hg38"]
    }
  ]
}
```

**songUrl**: the URL for your Overture DMS instance that corresponds to metadata retrieval for an analysis object.

**scoreUrl**: the URL for your Overture DMS instance that corresponds to object retirval for a data object.

**authToken**: your token for authenticating against resources found within your Overture DMS instance.

**studyId**: the Id for the study that corresponds to the analysis that you are attempting to retrieve.

**analysisId**: the Id for the analysis that you are attempting to retrieve.

**assemblyNames**: the assemblies for the files that are associated with the analysis you are attempting to retrieve.

## Usage

### In JBrowse Web and JBrowse Desktop

Install the Overture Plugin through the in-app plugin store. Need some help? [Check out the guide on how to use the plugin store here](https://jbrowse.org/jb2/docs/user_guides/plugin_store/).

**or** add to the "plugins" of your JBrowse Web config:

```json
{
  "plugins": [
    {
      "name": "Overture",
      "url": "https://unpkg.com/jbrowse-plugin-overture/dist/jbrowse-plugin-overture.umd.production.min.js"
    }
  ]
}
```

You can optionally add default analyses via the JBrowse config using the `configurationSchema` property, like so:

```json
  "plugins": [
    {
      "name": "Overture",
      "url": "https://unpkg.com/jbrowse-plugin-overture/dist/jbrowse-plugin-overture.umd.production.min.js",
      "configurationSchema": {
        "analyses": [
          {
            "songUrl": "https://some.url.org/v2/api",
            "scoreUrl": "https://some.other.url.org/v2/api",
            "authToken": "abcd1234",
            "studyId": "TEST-ST",
            "analysisId": "some-matching-analysis-id",
            "assemblyNames": ["hg38"],
          }
        ]
      }
    }
  ],
```

Once configured or installed via the UI:

1. Navigate to the Add Track workflow and select the new option for Add Overture analysis tracks.

2. Paste your analysis configuration (described above under ##config)

3. Submit, and the files associated with your analysis will be retrieved and displayed.

### Locally

### Software requirements

- [git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) (version 10 or greater)
- [yarn](https://yarnpkg.com/en/docs/install) (or npm which comes with Node.js)
- [JBrowse 2](https://github.com/gmod/jbrowse-components) (version 2.0 or greater)

```
git clone
cd jbrowse-plugin-overture
yarn
yarn start
```

Then (assuming [JBrowse Web](https://github.com/GMOD/jbrowse-components/tree/main/products/jbrowse-web) is running on port 3000), open the following:

[http://localhost:3000/?config=http://localhost:9000/jbrowse_config.json]

Need help getting JBrowse Web running? [Read the docs here](https://jbrowse.org/jb2/docs/quickstart_web/).
