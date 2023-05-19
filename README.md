![Integration](git@github.com:carolinebridge-oicr/jbrowse-plugin-overture/workflows/Integration/badge.svg?branch=main)

# jbrowse-plugin-overture

> JBrowse 2 plugin for connection to Overture instance resources.

## Config

**Coming soon**

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
