import React, { useState, FC } from 'react';
import {
  Paper,
  Button,
  Theme,
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles, createStyles } from '@material-ui/styles';
import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import clsx from 'clsx';
import { SearchHandler } from '../../types';

export interface SearchProps {
  className?: string;
  onSearch?: SearchHandler;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  search: {
    flexGrow: 1,
    height: 42,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: blueGrey[700],
  },
  searchInput: {
    flexGrow: 1,
  },
  searchButton: {
    marginLeft: theme.spacing(2),
  },
}));

const Search: FC<SearchProps> = ({
  className = '',
  onSearch = () => {},
}) => {
  const classes = useStyles();

  const [selectedDate, setSelectedDate] = useState<MaterialUiPickersDate>(new Date());

  const handleChange = (date: MaterialUiPickersDate) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSearch = () => {
    onSearch(selectedDate);
  };

  return (
    <div
      className={clsx(classes.root, className)}
    >
      <Paper
        className={classes.search}
        elevation={1}
      >
        <DatePicker
          value={selectedDate}
          views={['year', 'month']}
          variant="inline"
          openTo="month"
          format="yyyy年MMM"
          autoOk
          InputProps={{
            disableUnderline: true,
          }}
          onChange={handleChange}
        />
      </Paper>
      <Button
        className={classes.searchButton}
        onClick={handleSearch}
        size="large"
        variant="contained"
      >
        搜索
      </Button>
    </div>
  );
};

export default Search;
