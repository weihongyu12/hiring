const { toNumber } = require('lodash');
const { formatISO, parse } = require('date-fns');
const CategoriesModel = require('./CategoriesModel');
const csv2json = require('../utils/csv2json');
const csvAddRow = require('../utils/csvAddRow');

/**
 * @class BillModel
 */
class BillModel {
  /**
   * 获取多条账单数据
   * @return {Promise<Object[]>}
   */
  async index() {
    const json = await csv2json('../csv/bill.csv', {
      columns: true,
      cast(value, context) {
        if (context.column === 'type' || context.column === 'amount') {
          return toNumber(value);
        }

        if (context.column === 'time') {
          const parseTime = parse(value, 'T', new Date());
          return formatISO(parseTime);
        }
        return value;
      },
    });

    const mapper = async (current) => {
      const category = await this.getCategory(current.category);
      return {
        ...current,
        ...category,
      };
    };

    const resultJson = await Promise.allSettled(json.map(mapper));
    const results = resultJson
      .filter((result) => result.status === 'fulfilled')
      .map((current) => current.value);

    return results;
  }

  /**
   * 获取单条账单数据
   * @param {string} id - 查询的ID
   * @return {Promise<Object>}
   */
  async show(id) {
    const json = await this.index();
    return json.find((current) => current.id === id);
  }

  async create({
    type,
    time,
    category,
    amount,
  }) {
    const csvRows = [type, time, category, amount].join(',');
    await csvAddRow('../csv/bill.csv', csvRows);
  }

  async getCategory(categoryId) {
    const categoriesModel = new CategoriesModel();
    const category = await categoriesModel.show(categoryId);

    return {
      categoryId: category.id,
      category,
    };
  }
}

module.exports = BillModel;
