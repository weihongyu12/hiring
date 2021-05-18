const router = require('koa-router')();
const queryString = require('query-string');
const { format } = require('date-fns');
const BillModel = require('../model/BillModel');
const pagination = require('../utils/pagination');

router.prefix('/api/bill');

router.get('/', async (ctx, next) => {
  const { querystring } = ctx.request;
  const params = queryString.parse(querystring, {
    parseNumbers: true,
    parseBooleans: true,
  });

  const billModel = new BillModel();
  const json = await billModel.index();

  const result = pagination(json, {
    page: params.page,
    perPage: params.perPage,
    filter: {
      type: params.type,
      categoryId: params.categoryId,
      minAmount: params.minAmount,
      maxAmount: params.maxAmount,
      startTime: params.startTime,
      endTime: params.endTime,
    },
    orderBy: {
      sortBy: params.sortBy,
      order: params.order,
    },
  });

  ctx.body = result;
});

router.post('/', async (ctx, next) => {
  const { body } = ctx.request;

  const billModel = new BillModel();
  await billModel.create({
    type: body.type,
    amount: body.amount,
    category: body.categoryId,
    time: format(new Date(), 'T'),
  });

  ctx.status = 201;
  ctx.body = {
    error: false,
  };
});

module.exports = router;
