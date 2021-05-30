import React, { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import accounting from 'accounting';
import { CategoryAnalytics } from 'types';

export interface ReportProps {
  title: string;
  data: CategoryAnalytics[];
  className?: string;
}

const useStyles = makeStyles(() => createStyles({
  root: {},
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
}));

const Report: FC<ReportProps> = ({
  title,
  data,
  className = '',
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)}>
      <CardHeader title={title} />
      <CardContent className={classes.content}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>账单分类</TableCell>
                <TableCell align="right">合计金额</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data.map((row) => (
                  <TableRow key={row.categoriesId}>
                    <TableCell>{row.category.name}</TableCell>
                    <TableCell align="right">{accounting.formatMoney(row.total, '¥')}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Report;
