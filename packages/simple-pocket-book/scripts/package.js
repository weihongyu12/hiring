const path = require('path');
const fs = require('fs-extra');
const paths = require('../config/paths');

const appElectron = path.join(paths.appPath, 'electron');
const appElectronBuild = path.join(appElectron, 'build');

async function createElectronBuildFiles() {
  try {
    console.log(`Clean ${appElectronBuild}`)
    await fs.removeSync(appElectronBuild);

    console.log(`Create ${appElectronBuild}`)
    await fs.ensureDirSync(appElectronBuild);

    console.log(`Copy files ${paths.appBuild} to ${appElectronBuild}`)
    await fs.copySync(paths.appBuild, appElectronBuild, {
      dereference: true,
    });
  } catch (e) {
    console.error(e.message);
  }
}

createElectronBuildFiles();
