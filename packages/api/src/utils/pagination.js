const filterData = require('./filterData');

/**
 * 生成分页数据
 * @param {Object[]} data - 查询的总数据
 * @param {number} [page=1] - 页码
 * @param {number} [perPage=20] - 每页条数
 * @param {Object} [filter] - 过滤器
 * @param {Object} [orderBy] - 排序
 * @param {string} [orderBy.sortBy] - 排序字段
 * @param {string} [orderBy.order] - 排序方法 'asc'|'desc'
 * @return {{data: Object[], meta: {total: number, pages: number}}}
 */
function pagination(data, {
  page = 1,
  perPage = 20,
  filter,
  orderBy,
} = {}) {
  let result = [...data];
  let total = result.length;

  if (filter) {
    result = filterData(result, filter);
    total = result.length;
  }

  if (orderBy) {
    result = result.sort((a, b) => {
      if (a[orderBy.sortBy] > b[orderBy.sortBy]) {
        return orderBy.order === 'asc' ? 1 : -1;
      }
      if (a[orderBy.sortBy] < b[orderBy.sortBy]) {
        return orderBy.order === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  if (perPage !== -1) {
    const startIndex = page * perPage;
    const endIndex = (startIndex + perPage) - 1;
    result = result.filter((current, index) => index >= startIndex && index <= endIndex);
  }

  const pages = perPage === -1 ? 1 : Math.ceil(total / perPage);

  return {
    data: result,
    meta: {
      pages,
      total,
    },
  };
}

module.exports = pagination;
