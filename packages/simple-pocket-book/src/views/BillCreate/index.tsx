import React, { FC } from 'react';
import { Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { AuthGuard, Page } from 'components';
import { Header, BillForm } from './components';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3),
  },
}));

const BillCreate: FC = () => {
  const classes = useStyles();

  return (
    <AuthGuard roles={['ADMINISTRATOR', 'GENERAL_USER']}>
      <Page title="账单" className={classes.root}>
        <Header />
        <BillForm />
      </Page>
    </AuthGuard>
  );
};

export default BillCreate;
