import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Analytics } from 'types';
import { Charts, Report } from './components';

export interface ResultProps {
  data: Analytics;
  className?: string;
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

  const incomeReport = categories.filter((current) => current.category.type === 1);
  const expenditureReport = categories.filter((current) => current.category.type === 0);

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
            data={incomeReport}
            className={classes.content}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Report
            title="支出"
            data={expenditureReport}
            className={classes.content}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Result;
