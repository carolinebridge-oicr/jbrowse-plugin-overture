export const configure = async (analysis: any, assemblyNames: any) => {
  const data = await fetchMetadata(analysis)

  let configuredAnalysis = data.files.map(async (file: any) => {
    if (file.fileType === 'VCF' || file.fileType == 'BAM') {
      const index = findIndexFile(file.fileName, data.files)
      // index is undefined
      if (!index) {
        throw {
          name: 'NoIndexError',
          message: `There is no matching index file to ${file.fileName} in analysis ${analysis.analysisId}`,
        }
      }

      const urls = {
        fileUrl: await fetchData(
          analysis.scoreUrl,
          analysis.authToken,
          file.objectId,
          file.fileSize,
        ),
        // @ts-ignore
        indexUrl: await fetchData(
          analysis.scoreUrl,
          analysis.authToken,
          // @ts-ignore
          index.objectId,
          file.fileSize,
        ),
      }

      const trackTypeDetails = getTrackTypeDetails(file.fileType)
      return {
        type: trackTypeDetails.trackType,
        trackId: generateTrackId(file.fileName),
        name: file.fileName,
        assemblyNames: assemblyNames,
        category: ['Overture'],
        adapter: {
          type: trackTypeDetails.adapterType,
          [trackTypeDetails.locationType]: {
            uri: urls.fileUrl,
            locationType: 'UriLocation',
          },
          index: {
            location: {
              uri: urls.indexUrl,
              locationType: 'UriLocation',
            },
          },
        },
      }
    }
    return
  })

  configuredAnalysis = configuredAnalysis.filter((e: any) => {
    return e !== undefined
  })
  return configuredAnalysis
}

async function fetchMetadata(analysis: any) {
  const dataPath = `${analysis.songUrl}/studies/${analysis.studyId}/analysis/${analysis.analysisId}`

  const response = await fetch(dataPath, {
    headers: {
      Accept: '*/*',
    },
  })

  if (response.ok) {
    return await response.json()
  }
}

async function fetchData(
  scoreUrl: string,
  authToken: string,
  objectId: string,
  fileSize: string,
) {
  const dataPath = `${scoreUrl}/download/${objectId}?offset=0&length=${fileSize}&external=false&exclude-urls=false`

  const response = await fetch(dataPath, {
    headers: {
      'User-Agent': 'unknown',
      Accept: '*/*',
      Authorization: authToken,
    },
  })

  if (response.ok) {
    const json = await response.json()

    return json.parts[0].url
  }
}

function getTrackTypeDetails(fileType: string) {
  const map = {
    BAM: {
      trackType: 'AlignmentsTrack',
      adapterType: 'BamAdapter',
      locationType: 'bamLocation',
    },
    VCF: {
      trackType: 'VariantTrack',
      adapterType: 'VcfTabixAdapter',
      locationType: 'vcfGzLocation',
    },
  }
  //@ts-ignore
  return map[fileType]
}

function generateTrackId(name: string) {
  return `${name}-${Date.now()}`
}

function findIndexFile(fileName: string, fileArray: []) {
  return fileArray.find((file: any) => file.fileName.includes(fileName))
}
