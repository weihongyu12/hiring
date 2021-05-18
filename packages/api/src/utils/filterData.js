const {
  isNumber,
  isString,
  isUndefined,
  snakeCase,
} = require('lodash');
const {
  isBefore,
  isAfter,
  isValid,
  parseISO,
} = require('date-fns');

/**
 * 过滤数据
 * @param {Object[]} data - 需要过滤的数据
 * @param {Object} filter - 过滤器
 * @return {*[]}
 */
function filterData(data, filter) {
  /**
   * 转化key名称
   * @param {string} key - 过滤字段的key
   * @param {string} startsWith - 替换字符串：'min'|'max'|'start'|'end'
   */
  const getKeyName = (key, startsWith) => snakeCase(key.replace(startsWith, ''));

  let result = [...data];
  Object.entries(filter).forEach(([key, value]) => {
    if (!isUndefined(value)) {
      const hasKeys = result.find((current) => current[key]);
      if (hasKeys) {
        if (isString(value)) {
          result = result.filter((current) => current[key].includes(value));
        } else {
          result = result.filter((current) => current[key] === value);
        }
      }

      if (key.startsWith('min') && isNumber(value)) {
        const keyName = getKeyName(key, 'min');
        result = result.filter((current) => current[keyName] >= value);
      }

      if (key.startsWith('max') && isNumber(value)) {
        const keyName = getKeyName(key, 'max');
        result = result.filter((current) => current[keyName] <= value);
      }

      if (key.startsWith('start') && isValid(parseISO(value))) {
        const keyName = getKeyName(key, 'start');
        result = result.filter((current) => isAfter(parseISO(current[keyName]), parseISO(value)));
      }

      if (key.startsWith('end') && isValid(parseISO(value))) {
        const keyName = getKeyName(key, 'end');
        result = result.filter((current) => isBefore(parseISO(current[keyName]), parseISO(value)));
      }
    }
  });

  return result;
}

module.exports = filterData;
