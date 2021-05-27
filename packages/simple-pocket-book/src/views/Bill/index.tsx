import React, { useEffect, useState, FC } from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { AuthGuard, Page } from 'components';
import { billService } from 'service';
import { Bill as BillTypes, Order } from 'types';
import { Header, Result, SearchBar } from './components';

interface FetchBillParams {
  currentPage: number;
  perPage: number;
  sortBy?: string;
  orderBy?: Order | ''
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3),
  },
}));

const Bill: FC = () => {
  const classes = useStyles();

  const [data, setData] = useState<BillTypes[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<Order>('asc');
  const [sortby, setSortby] = useState<string>('');
  const [filter, setFilter] = useState<Record<string, unknown>>({});

  const handleChangePage = (currentPage: number) => {
    setPage(currentPage);
  };

  const handleChangeRowsPerPage = (perPage: number) => {
    setPage(0);
    setRowsPerPage(perPage);
  };

  const handleSort = (property: string) => {
    const isAsc = sortby === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSortby(property);
    setPage(0);
  };

  const handleFilter = (filters: Record<string, unknown>) => {
    setFilter(filters);
    setPage(0);
  };

  useEffect(() => {
    const fetchBill = async ({
      currentPage,
      perPage,
      sortBy,
      orderBy,
      ...params
    }: FetchBillParams) => {
      const response = await billService.index({
        perPage,
        page: currentPage,
        sortBy: sortBy || undefined,
        order: orderBy || undefined,
        ...params,
      });
      setData([...response.data]);
      setCount(response.meta.total);
    };

    fetchBill({
      currentPage: page,
      perPage: rowsPerPage,
      sortBy: sortby,
      orderBy: order,
      ...filter,
    });
  }, [page, rowsPerPage, sortby, order, filter]);

  return (
    <AuthGuard roles={['ADMINISTRATOR', 'GENERAL_USER']}>
      <Page title="账单" className={classes.root}>
        <Header />
        <SearchBar
          onFilter={handleFilter}
        />
        <Result
          data={data}
          page={page}
          count={count}
          rowsPerPage={rowsPerPage}
          sortby={sortby}
          order={order}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onSort={handleSort}
        />
      </Page>
    </AuthGuard>
  );
};

export default Bill;
