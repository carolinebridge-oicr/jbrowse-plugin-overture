/**
 * configures an analysis to tracks using details from the analyses object
 * @param analysis a single analysis that contains several files to be set as tracks
 * @param assemblyNames the assemblies the tracks belong to
 * @param onLoad if defined, uses a set trackId for the track to load as to not duplicate tracks on refresh
 * @returns a list of promises to resolve for the tracks
 */
export const configure = async (
  analysis: any,
  assemblyNames: any,
  onLoad?: string,
) => {
  const data = await fetchMetadata(analysis)

  let configuredAnalysis = data.files.map(async (file: any) => {
    if (file.fileType === 'VCF' || file.fileType == 'BAM') {
      const trackTypeDetails = getTrackTypeDetails(file.fileType)
      const index = findIndexFile(
        file.fileName,
        trackTypeDetails.indexSuffix,
        data.files,
      )
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

      return {
        type: trackTypeDetails.trackType,
        trackId: generateTrackId(file.fileName, onLoad),
        name: file.fileName,
        assemblyNames: assemblyNames,
        category: ['Overture'],
        adapter: {
          type: trackTypeDetails.adapterType,
          [trackTypeDetails.locationType]: {
            uri: `http://localhost:7070/proxy/${urls.fileUrl.substring(56)}`,
            locationType: 'UriLocation',
          },
          index: {
            location: {
              uri: `http://localhost:7070/proxy/${urls.indexUrl.substring(56)}`,
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

/**
 * function to fetch metadata from the song endpoint
 * @param analysis the analysis object to fetch
 * @returns a json representation of the analysis metadata
 */
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

/**
 * function to fetch the signed URLs for the physical files from the score endpoint
 * @param scoreUrl the url to fetch from that coordinates with the score instance
 * @param authToken the user's auth token to check the resource permissions against
 * @param objectId the id of the object to be fetched from score
 * @param fileSize the size of the object to be fetched -- as this endpoint can fetch partial objects
 * @returns
 */
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

/**
 * configures track details based on the fileType found in the metadata
 * @param fileType the type of file, string
 * @returns an object with details necessary to create the track for such a fileType
 */
function getTrackTypeDetails(fileType: string) {
  const map = {
    BAM: {
      trackType: 'AlignmentsTrack',
      adapterType: 'BamAdapter',
      locationType: 'bamLocation',
      indexSuffix: 'bai',
    },
    VCF: {
      trackType: 'VariantTrack',
      adapterType: 'VcfTabixAdapter',
      locationType: 'vcfGzLocation',
      indexSuffix: 'idx',
    },
  }
  //@ts-ignore
  return map[fileType]
}

/**
 * a function that returns a unique track id
 * @param name the name of the file to add to the track id
 * @param onLoad if defined, returns the same trackid for a given filename so as to not duplicate tracks on refresh when an analysis is configured in the jbrowse config
 * @returns a unique string id
 */
function generateTrackId(name: string, onLoad?: string) {
  if (onLoad) {
    return `${name}-onload`
  }
  return `${name}-${Date.now()}`
}

/**
 * function to find the associated index file for a given filename within the array of files found in the analysis
 * @param fileName the name of the file to be found its coordinating index of
 * @param suffix the index file suffix to find
 * @param fileArray the array of files from the analysis
 * @returns a file that includes the file's name plus its index file suffix
 */
function findIndexFile(fileName: string, suffix: string, fileArray: []) {
  return fileArray.find(
    (file: any) => file.fileName === `${fileName}.${suffix}`,
  )
}
