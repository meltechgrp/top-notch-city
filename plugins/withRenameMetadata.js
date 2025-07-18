const { withAndroidManifest } = require('@expo/config-plugins');

function renameMetadata(androidManifest, existingName, newName) {
  const metaData = androidManifest.manifest.application[0]['meta-data'];
  const hasExistingNameEntry = metaData.findIndex(
    (meta) => meta['$']['android:name'] === existingName
  ) !== -1;

  if (hasExistingNameEntry) {
    // Remove all entries with new name
    const newNameMetaDataEntriesIndices = metaData.reduce((acc, meta, index) => {
      if (meta['$']['android:name'] === newName) {
        acc.push(index);
      }
      return acc;
    }, []);

    // Remove all entries with new name, starting from end to avoid index shifting
    for (let i = newNameMetaDataEntriesIndices.length - 1; i >= 0; i--) {
      metaData.splice(newNameMetaDataEntriesIndices[i], 1);
    }

    // Find the index again after deletions and update it
    const indexToUpdate = metaData.findIndex(
      (meta) => meta['$']['android:name'] === existingName
    );
    if (indexToUpdate !== -1) {
      metaData[indexToUpdate]['$']['android:name'] = newName;
    } else {
      console.warn(
        `Meta-data with name ${existingName} not found after deleting existing new name entries`
      );
    }
  } else {
    console.warn(`Meta-data with name ${existingName} not found`);
  }
  return androidManifest;
};

module.exports = function withRenameMetadata(config, { existingName, newName }) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    config.modResults = renameMetadata(androidManifest, existingName, newName);
    return config;
  });
};