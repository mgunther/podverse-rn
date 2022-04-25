import { Platform } from 'react-native'
import RNFetchBlob from 'react-native-blob-util'

const sessionKey = 'podverse-cache'

export const getPlayerCachedFilePath = async (mediaFileUrl: string, Authorization?: string) => {
  return new Promise(async (resolve, reject) => {
    console.log('hello', mediaFileUrl, Authorization)
    await RNFetchBlob.config({
      ...(Authorization ? { Authorization } : {}),
      fileCache: true,
      session: sessionKey
    }).fetch('GET', mediaFileUrl, {
      'Transfer-Encoding': 'Chunked'
    }).then((response) => {
      console.log('hello 2')
      const cachedFilePath = generateCachedFilePath(response)
      console.log('cachedFilePath', cachedFilePath)
      // trimPlayerCacheToMaximumLimit()
      resolve(cachedFilePath)
    }).catch((error) => {
      reject(error)
    })
  })
}

// Beware that when using a file path as Image source on Android,
// you must prepend "file://"" before the file path
// https://www.npmjs.com/package/react-native-blob-util#download-to-storage-directly
const generateCachedFilePath = (response: any) => {
  return Platform.OS === 'android' ? 'file://' + response.path() : '' + response.path()
}

/* Currently limiting the player cache to 10 media files. */
const trimPlayerCacheToMaximumLimit = () => {
  const maxCachePaths = 10
  const cachePaths = RNFetchBlob.session(sessionKey).list()
  console.log('trimPlayerCacheToMaximumLimit cachePaths', cachePaths)
  const newPaths = cachePaths.slice(0, maxCachePaths)
  console.log('trimPlayerCacheToMaximumLimit newPaths', newPaths)
  const pathsToRemove = cachePaths.slice(maxCachePaths)
  console.log('trimPlayerCacheToMaximumLimit pathsToRemove', pathsToRemove)
  unlinkPathsFromPlayer(pathsToRemove)
}

/* We have to manually keep track of and delete files from the cache. */
const unlinkPathsFromPlayer = (pathsToRemove: string[]) => {
  const beforeCachePaths = RNFetchBlob.session(sessionKey).list()
  console.log('beforeCachePaths', beforeCachePaths)
  for (const pathToRemove of pathsToRemove) {
    try {
      RNFetchBlob.session(sessionKey).remove(pathToRemove)
    } catch (error) {
      console.log('trimPlayerCacheToMaximumLimit error', error)
    }
  }
  const afterCachePaths = RNFetchBlob.session(sessionKey).list()
  console.log('afterCachePaths', afterCachePaths)
}