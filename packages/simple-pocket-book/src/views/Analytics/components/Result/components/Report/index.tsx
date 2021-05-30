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
  TableSortLabel,
  SortDirection,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import accounting from 'accounting';
import { CategoryAnalytics } from 'types';

type SortHandler = () => void;

export interface ReportProps {
  title: string;
  data: CategoryAnalytics[];
  order?: SortDirection;
  className?: string;
  onSort?: SortHandler;
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
  order = false,
  className = '',
  onSort = () => {},
}) => {
  const classes = useStyles();

  const handleSort = () => {
    onSort();
  };

  return (
    <Card className={clsx(classes.root, className)}>
      <CardHeader title={title} />
      <CardContent className={classes.content}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>账单分类</TableCell>
                <TableCell
                  align="right"
                  sortDirection={order || false}
                >
                  <TableSortLabel
                    active={!!(order)}
                    direction={order || 'asc'}
                    onClick={handleSort}
                  >
                    合计金额
                  </TableSortLabel>
                </TableCell>
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
