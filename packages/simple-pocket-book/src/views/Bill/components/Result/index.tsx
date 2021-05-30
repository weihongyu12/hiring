import React, {
  useState,
  FC,
  MouseEvent,
  ChangeEvent,
} from 'react';
import {
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  ArrowForward as ArrowForwardIcon,
} from '@material-ui/icons';
import { createStyles, makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import accounting from 'accounting';
import { format, parseISO } from 'date-fns';
import zhHansLocale from 'date-fns/locale/zh-CN';
import { toInteger } from 'lodash';
import { Tag } from 'components';
import { Bill, Order } from 'types';
import TableEditBar from './components/TableEditBar';

type ChangePageHandler = (page: number) => void;
type ChangeRowsPerPageHandler = (rowsPerPage: number) => void;
type SortHandler = (property: string) => void;
type DeleteHandler = () => void;

export interface ResultProps {
  data: Bill[];
  page: number;
  count: number;
  rowsPerPage: number;
  sortby?: string;
  order?: Order;
  className?: string;
  onChangePage?: ChangePageHandler;
  onChangeRowsPerPage?: ChangeRowsPerPageHandler;
  onSort?: SortHandler;
  onDelete?: DeleteHandler;
}

interface TagSetting {
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  name: string;
}

type TypeTag = Record<number, TagSetting>;

const useStyles = makeStyles(() => createStyles({
  root: {},
  tableCell: {
    minWidth: '10em',
  },
}));

const Result: FC<ResultProps> = ({
  data,
  page,
  count,
  rowsPerPage,
  sortby = '',
  order = 'asc',
  className = '',
  onChangePage = () => {},
  onChangeRowsPerPage = () => {},
  onSort = () => {},
  onDelete = () => {},
}) => {
  const classes = useStyles();

  const [selected, setSelected] = useState<string[]>([]);

  const typeTag: TypeTag = {
    0: {
      color: 'secondary',
      name: '支出',
    },
    1: {
      color: 'primary',
      name: '收入',
    },
  };

  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onChangePage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChangeRowsPerPage(toInteger(event.target.value));
  };

  const handleSort = (property: string) => () => {
    onSort(property);
  };

  const handleSelectedAll = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedAll = event.target.checked;
    if (selectedAll) {
      const selectedRows = data.map((value) => JSON.stringify(value));
      setSelected([...selectedRows]);
    } else {
      setSelected([]);
    }
  };

  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    const index = selected.findIndex((value) => Object.is(value, event.target.value));

    if (index >= 0) {
      const newSelected = selected;
      newSelected.splice(index, 1);
      setSelected([...newSelected]);
    } else {
      const newSelected = [...selected, event.target.value];
      setSelected([...newSelected]);
    }
  };

  const handleDelete = async () => {
    onDelete();
  };

  return (
    <Paper className={clsx(classes.root, className)}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  value="全选/全不选"
                  onChange={handleSelectedAll}
                />
              </TableCell>
              <TableCell
                sortDirection={sortby === 'categoryId' ? order : false}
                className={classes.tableCell}
              >
                <TableSortLabel
                  active={sortby === 'categoryId'}
                  direction={sortby === 'categoryId' ? order : 'asc'}
                  onClick={handleSort('categoryId')}
                >
                  账单分类
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.tableCell}>账单类型</TableCell>
              <TableCell
                sortDirection={sortby === 'amount' ? order : false}
                className={classes.tableCell}
              >
                <TableSortLabel
                  active={sortby === 'amount'}
                  direction={sortby === 'amount' ? order : 'asc'}
                  onClick={handleSort('amount')}
                >
                  账单金额
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={sortby === 'categoryId' ? order : false}
                className={classes.tableCell}
              >
                <TableSortLabel
                  active={sortby === 'time'}
                  direction={sortby === 'time' ? order : 'asc'}
                  onClick={handleSort('time')}
                >
                  账单时间
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.tableCell}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.map((row) => (
                <TableRow key={`${row.type}${row.categoryId}${row.amount}${row.time}`}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      value={JSON.stringify(row)}
                      checked={selected.includes(JSON.stringify(row))}
                      onChange={handleCheck}
                    />
                  </TableCell>
                  <TableCell>{row.category.name}</TableCell>
                  <TableCell>
                    <Tag color={typeTag[row.type].color}>
                      {typeTag[row.type].name}
                    </Tag>
                  </TableCell>
                  <TableCell>{accounting.formatMoney(row.amount, '¥')}</TableCell>
                  <TableCell>
                    <Tooltip title={row.time}>
                      <span>
                        {format(parseISO(row.time), 'PPP HH:mm:ss', { locale: zhHansLocale })}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="编辑">
                      <IconButton size="small" aria-label="编辑">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton size="small" aria-label="删除">
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="查看详情">
                      <IconButton size="small" aria-label="查看详情">
                        <ArrowForwardIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: { 'aria-label': '每页行数' },
          native: true,
        }}
        component="div"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <TableEditBar
        selected={selected}
        onDelete={handleDelete}
      />
    </Paper>
  );
};

export default Result;
