import React, { useState, FC } from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, Button, Theme } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import Filter, { FilterHandler } from './components/Filter';

export interface SearchBarProps {
  className?: string;
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
  onFilter = () => {},
}) => {
  const classes = useStyles();

  const [openFilter, setOpenFilter] = useState(false);

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
      justify="flex-end"
      alignItems="center"
      container
    >
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
