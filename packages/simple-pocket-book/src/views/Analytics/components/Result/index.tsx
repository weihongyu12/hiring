import React, { useEffect, useState, FC } from 'react';
import { Grid, SortDirection } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Analytics, CategoryAnalytics } from 'types';
import { Charts, Report } from './components';

export interface ResultProps {
  data: Analytics;
  className?: string;
}

type KeyMap = 'income' | 'expenditure';

interface ReportState {
  income: CategoryAnalytics[];
  expenditure: CategoryAnalytics[];
}

interface OrderState {
  income: SortDirection;
  expenditure: SortDirection;
}

const useStyles = makeStyles(() => createStyles({
  root: {},
  content: {
    height: '100%',
  },
}));

const Result: FC<ResultProps> = ({
  data,
  className = '',
}) => {
  const classes = useStyles();
  const { income, expenditure, categories } = data;

  const [report, setReport] = useState<ReportState>({
    income: [],
    expenditure: [],
  });
  const [order, setOrder] = useState<OrderState>({
    income: false,
    expenditure: false,
  });

  const handleSort = (key: KeyMap) => {
    const newSortDirection = order[key] === 'asc' ? 'desc' : 'asc';
    setOrder((prevState) => ({
      ...prevState,
      [key]: newSortDirection,
    }));

    const newReport = report[key].sort((a, b) => (newSortDirection === 'asc' ? a.total - b.total : b.total - a.total));
    setReport((prevState) => ({
      ...prevState,
      [key]: [...newReport],
    }));
  };

  useEffect(() => {
    // eslint-disable-next-line max-len
    const filterCategories = (type: number) => categories.filter((current) => current.category.type === type);

    const incomeReport = filterCategories(1);
    const expenditureReport = filterCategories(0);

    setReport({
      income: [...incomeReport],
      expenditure: [...expenditureReport],
    });
    setOrder({
      income: false,
      expenditure: false,
    });
  }, [categories]);

  return (
    <div className={clsx(classes.root, className)}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} sm={12} md={6}>
          <Charts
            income={income}
            expenditure={expenditure}
            className={classes.content}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Report
            title="收入"
            data={report.income}
            order={order.income}
            className={classes.content}
            onSort={() => {
              handleSort('income');
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Report
            title="支出"
            data={report.expenditure}
            order={order.expenditure}
            className={classes.content}
            onSort={() => {
              handleSort('expenditure');
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Result;
