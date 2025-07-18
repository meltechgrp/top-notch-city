const { withAndroidManifest } = require('@expo/config-plugins')

function addAttributesToQueries(androidManifest, attributes) {
  const { manifest } = androidManifest
  if (!Array.isArray(manifest['queries'])) {
    manifest['queries'] = [{ package: [] }]
  }

  if (!Array.isArray(manifest['queries'][0]['package'])) {
    manifest['queries'][0]['package'] = []
  }
  attributes.forEach((attribute) => {
    const activity = manifest['queries'][0]['package'].find(
      (item) => item.$['android:name'] === attribute
    )

    if (!activity) {
      manifest['queries'][0]['package'].push({
        $: {
          'android:name': attribute,
        },
      })
    }
  })

  return { ...androidManifest, manifest }
}

module.exports = function withAndroidQueries(config, attributes) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addAttributesToQueries(config.modResults, attributes)
    return config
  })
}
