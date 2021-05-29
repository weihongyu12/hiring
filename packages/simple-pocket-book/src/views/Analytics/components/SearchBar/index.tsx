import React, { useState, FC } from 'react';
import { Grid, Button, Theme } from '@material-ui/core';
import { FilterList as FilterListIcon } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Search, Filter } from './components';
import { SearchHandler, FilterHandler } from './types';

export interface SearchBarProps {
  className?: string;
  onSearch?: SearchHandler;
  onFilter?: FilterHandler;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1),
  },
  filterButton: {
    marginLeft: 'auto',
  },
}));

const SearchBar: FC<SearchBarProps> = ({
  className = '',
  onSearch = () => {},
  onFilter = () => {},
}) => {
  const classes = useStyles();

  const [openFilter, setOpenFilter] = useState(false);

  const handleSearch = (date: MaterialUiPickersDate) => {
    onSearch(date);
  };

  const handleFilterOpen = () => {
    setOpenFilter(true);
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  const handleFilter = (filter: Record<string, unknown>) => {
    setOpenFilter(false);
    onFilter(filter);
  };

  return (
    <Grid
      className={clsx(classes.root, className)}
      spacing={3}
      justify="space-between"
      alignItems="center"
      container
    >
      <Grid item>
        <Search onSearch={handleSearch} />
      </Grid>
      <Grid item>
        <Button
          className={classes.filterButton}
          color="primary"
          onClick={handleFilterOpen}
          size="small"
          variant="outlined"
          startIcon={<FilterListIcon />}
        >
          高级搜索
        </Button>
      </Grid>
      <Filter
        onClose={handleFilterClose}
        onFilter={handleFilter}
        open={openFilter}
      />
    </Grid>
  );
};

export default SearchBar;
