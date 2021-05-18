const { toNumber } = require('lodash');
const csv2json = require('../utils/csv2json');

/**
 * @class CategoriesModel
 */
class CategoriesModel {
  /**
   * 获取多条账单分类
   * @return {Promise<number|*>}
   */
  async index() {
    const json = await csv2json('../csv/categories.csv', {
      columns: true,
      cast(value, context) {
        if (context.column === 'type') {
          return toNumber(value);
        }
        return value;
      },
    });

    return json;
  }

  /**
   * 获取单条账单分类
   * @param {string} id - 账单分类ID
   * @return {Promise<*>}
   */
  async show(id) {
    const json = await this.index();
    return json.find((current) => current.id === id);
  }
}

module.exports = CategoriesModel;
