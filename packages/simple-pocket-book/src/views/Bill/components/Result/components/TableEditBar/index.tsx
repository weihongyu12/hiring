import React, { FC } from 'react';
import {
  Button,
  Drawer,
  Grid,
  Hidden,
  Typography,
  Theme,
} from '@material-ui/core';
import { DeleteOutline as DeleteIcon } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';

type DeleteHandler = () => void;

export interface TableEditBarProps {
  selected: string[];
  className?: string;
  onDelete?: DeleteHandler;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const TableEditBar: FC<TableEditBarProps> = ({
  selected,
  className = '',
  onDelete = () => {},
}) => {
  const classes = useStyles();

  const open = selected.length > 0;

  const handleDelete = () => {
    onDelete();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      PaperProps={{ elevation: 1 }}
      variant="persistent"
    >
      <div className={clsx(classes.root, className)}>
        <Grid
          alignItems="center"
          container
          spacing={2}
        >
          <Hidden smDown>
            <Grid
              item
              md={3}
            >
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                选中
                {selected.length}
                {' '}
              </Typography>
            </Grid>
          </Hidden>
          <Grid
            item
            md={6}
            xs={12}
          >
            <div className={classes.actions}>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                删除
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  );
};

export default TableEditBar;
