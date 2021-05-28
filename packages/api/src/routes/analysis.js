const router = require('koa-router')();
const queryString = require('query-string');
const { add } = require('mathjs');
const BillModel = require('../model/BillModel');
const CategoriesModel = require('../model/CategoriesModel');
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

  const categoriesModel = new CategoriesModel();
  const categories = await categoriesModel.index();

  const filterParams = {
    amount: params.amount,
    minAmount: params.minAmount,
    maxAmount: params.maxAmount,
    startTime: params.startTime,
    endTime: params.endTime,
  };

  const reducerTotalAmount = (accumulator, current) => add(accumulator, current.amount);

  const categoriesAnalysis = categories.map((category) => {
    const currentBill = filterData(bill, {
      ...filterParams,
      categoryId: category.id,
    });

    const total = currentBill.reduce(reducerTotalAmount, 0);

    return {
      categoriesId: category.id,
      category,
      total,
    };
  });

  const incomeJson = filterData(bill, {
    type: 1,
    ...filterParams,
  });

  const expenditureJson = filterData(bill, {
    type: 0,
    ...filterParams,
  });

  const income = incomeJson.reduce(reducerTotalAmount, 0);
  const expenditure = expenditureJson.reduce(reducerTotalAmount, 0);

  ctx.body = {
    income,
    expenditure,
    categories: categoriesAnalysis,
  };
});

module.exports = router;
