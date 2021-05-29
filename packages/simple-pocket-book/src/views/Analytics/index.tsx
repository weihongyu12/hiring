import React, {
  useCallback,
  useEffect,
  useState,
  FC,
} from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';
import { AuthGuard, Page } from 'components';
import { analyticsService } from 'service';
import { Analytics as AnalyticsTypes, AnalyticsShowRequest } from 'types';
import { Header, SearchBar, Result } from './components';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(3),
  },
}));

const initialState = {
  income: 0,
  expenditure: 0,
  categories: [],
};

const Analytics: FC = () => {
  const classes = useStyles();

  const [result, setResult] = useState<AnalyticsTypes>({ ...initialState });
  const [search, setSearch] = useState<MaterialUiPickersDate>(new Date());
  const [filter, setFilter] = useState<Record<string, unknown>>({});

  const fetchData = useCallback(async (params: AnalyticsShowRequest) => {
    try {
      const response = await analyticsService.show({ ...params });
      setResult({
        income: response.income,
        expenditure: response.expenditure,
        categories: [...response.categories],
      });
    } catch (e) {
      setResult({ ...initialState });
    }
  }, []);

  const handleSearch = (date: MaterialUiPickersDate) => {
    setSearch(date);
    fetchData({
      startTime: date ? formatISO(startOfMonth(date)) : undefined,
      endTime: date ? formatISO(endOfMonth(date)) : undefined,
      ...filter,
    });
  };

  const handleFilter = (filters: Record<string, unknown>) => {
    setFilter(filters);
    fetchData({
      startTime: search ? formatISO(startOfMonth(search)) : undefined,
      endTime: search ? formatISO(endOfMonth(search)) : undefined,
      ...filters,
    });
  };

  useEffect(() => {
    fetchData({
      startTime: formatISO(startOfMonth(new Date())),
      endTime: formatISO(startOfMonth(new Date())),
    });
  }, [fetchData]);

  return (
    <AuthGuard roles={['ADMINISTRATOR', 'GENERAL_USER']}>
      <Page title="账单统计" className={classes.root}>
        <Header />
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
        <Result data={result} />
      </Page>
    </AuthGuard>
  );
};

export default Analytics;
