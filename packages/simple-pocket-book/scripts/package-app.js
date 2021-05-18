const path = require('path');
const fs = require('fs-extra');
const glob = require('glob-all');
const paths = require('../config/paths');

const androidPublic = path.join(paths.appPath, 'android/app/src/main/assets/public');
const iosPublic = path.join(paths.appPath, 'ios/App/public');

async function removeDuplicateResource() {
  try {
    console.log(`[Android] remove duplicate resource: ${androidPublic}`)
    const androidResource = glob.sync([
      path.join(androidPublic, '**/*.gz'),
      path.join(androidPublic, '**/*.br'),
    ]);
    androidResource.forEach((file) => fs.remove(file));
    console.log('[Android] remove duplicate resource success!');

    console.log(`[iOS] remove duplicate resource: ${iosPublic}`);
    const iosResource = glob.sync([
      path.join(iosPublic, '**/*.gz'),
      path.join(iosPublic, '**/*.br'),
    ]);
    iosResource.forEach((file) => fs.remove(file));
    console.log('[iOS] remove duplicate resource success!');
  } catch (err) {
    console.error(err)
  }
}

removeDuplicateResource();
