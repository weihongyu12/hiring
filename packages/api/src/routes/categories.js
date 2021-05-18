const router = require('koa-router')();
const queryString = require('query-string');
const CategoriesModel = require('../model/CategoriesModel');
const pagination = require('../utils/pagination');

router.prefix('/api/categories');

router.get('/', async (ctx, next) => {
  const { querystring } = ctx.request;
  const params = queryString.parse(querystring, {
    parseNumbers: true,
    parseBooleans: true,
  });

  const categoriesModel = new CategoriesModel();
  const json = await categoriesModel.index();

  const result = pagination(json, {
    page: params.page,
    perPage: params.perPage,
    filter: {
      type: params.type,
      name: params.name,
      category: params.category,
    },
    orderBy: {
      sortBy: params.sortBy,
      order: params.order,
    },
  });

  ctx.body = result;
});

module.exports = router;
