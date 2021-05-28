import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Breadcrumbs,
  Grid,
  Link,
  Typography,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';

export interface HeaderProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

const Header: FC<HeaderProps> = ({ className = '' }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Grid container justify="space-between">
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
            >
              首页
            </Link>
            <Link
              component={RouterLink}
              to="/bill"
              color="inherit"
            >
              账单
            </Link>
            <Typography color="textPrimary">创建账单</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h3"
          >
            创建账单
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Header;
