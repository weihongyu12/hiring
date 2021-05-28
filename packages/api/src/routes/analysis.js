const router = require('koa-router')();
const queryString = require('query-string');
const { add } = require('mathjs');
const BillModel = require('../model/BillModel');
const filterData = require('../utils/filterData');

router.prefix('/api/analysis');

router.get('/', async (ctx, next) => {
  const { querystring } = ctx.request;
  const params = queryString.parse(querystring, {
    parseNumbers: true,
    parseBooleans: true,
  });

  const billModel = new BillModel();
  const bill = await billModel.index();

  const filterParams = {
    category: params.category,
    amount: params.amount,
    minAmount: params.minAmount,
    maxAmount: params.maxAmount,
    startTime: params.startTime,
    endTime: params.endTime,
  };

  const incomeJson = filterData(bill, {
    type: 1,
    ...filterParams,
  });

  const expenditureJson = filterData(bill, {
    type: 0,
    ...filterParams,
  });

  const reducerTotalAmount = (accumulator, current) => add(accumulator, current.amount);

  const income = incomeJson.reduce(reducerTotalAmount, 0);
  const expenditure = expenditureJson.reduce(reducerTotalAmount, 0);

  ctx.body = {
    income,
    expenditure,
  };
});

module.exports = router;
