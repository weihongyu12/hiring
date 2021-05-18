const fs = require('fs');
const path = require('path');

/**
 * 插入CSV文件行
 * @param {string} filePath - CSV文件路径
 * @param {string} csvRow - 插入的CSV行
 * @return {Promise<void>}
 */
async function csvAddRow(filePath, csvRow) {
  const file = path.resolve(__dirname, filePath);
  fs.writeFile(file, `${csvRow}\n`, {
    encoding: 'utf8',
    flag: 'a',
  }, (err) => {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve();
  });
}

module.exports = csvAddRow;
