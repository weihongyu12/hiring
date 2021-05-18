const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');

/**
 * 解析CSV文件为json
 * @param {string} filePath - 文件路径
 * @param {Object} {...options} - csv-parse的配置
 * @return {Promise<*>}
 */
async function csv2json(filePath, { ...options } = {}) {
  try {
    const csvData = await fs.readFileSync(path.resolve(__dirname, filePath), {
      encoding: 'utf-8',
    });
    const records = await parse(csvData, {
      ...options,
    });
    return Promise.resolve(records);
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = csv2json;
