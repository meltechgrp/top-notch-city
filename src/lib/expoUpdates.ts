import * as Updates from 'expo-updates'

export async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync()

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    }
  } catch (error) {
    console.log('EAS update error: ', error)
  }

  return onFetchUpdateAsync
}