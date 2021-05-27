import React, {
  useEffect,
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/styles';
import {
  Button,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Typography,
  Theme,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import accounting from 'accounting';
import { format } from 'date-fns';
import { categoryService } from 'service';
import { Category } from 'types';

type FieldChangeEvent =
  ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?:string, value: unknown } | unknown>
  | MouseEvent<HTMLElement>
  | null;

type CategoryType = '0' | '1';
type CategoryTypeRequest = CategoryType | '';

export interface FilterValue {
  type: CategoryType | '';
  categoryId: string;
  amount: number[];
  startTime: MaterialUiPickersDate | null;
  endTime: MaterialUiPickersDate | null;
}

type CloseHandler = () => void;
export type FilterHandler = (filter: Record<string, unknown>) => void;

export interface FilterProps {
  open: boolean;
  className?: string;
  onClose?: CloseHandler;
  onFilter?: FilterHandler;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  drawer: {
    width: 420,
    maxWidth: '100%',
  },
  header: {
    padding: theme.spacing(2, 1),
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  content: {
    padding: theme.spacing(0, 3),
    flexGrow: 1,
  },
  contentSection: {
    padding: theme.spacing(2, 0),
  },
  contentSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  contentSectionContent: {},
  formGroup: {
    padding: theme.spacing(2, 0),
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  field: {
    marginTop: 0,
    marginBottom: 0,
  },
  flexGrow: {
    flexGrow: 1,
  },
  horizontalDivider: {
    margin: theme.spacing(0, 1),
  },
  minAmount: {
    marginRight: theme.spacing(3),
  },
  maxAmount: {
    marginLeft: theme.spacing(3),
  },
  radioGroup: {},
  actions: {
    padding: theme.spacing(3),
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Filter: FC<FilterProps> = ({
  open,
  className = '',
  onClose = () => {},
  onFilter = () => {},
}) => {
  const classes = useStyles();

  const initialValues: FilterValue = {
    type: '',
    categoryId: '',
    amount: [1500, 4500],
    startTime: null,
    endTime: null,
  };

  const [expand, setExpand] = useState<boolean>(true);
  const [values, setValues] = useState<FilterValue>({ ...initialValues });
  const [categories, setCategories] = useState<Category[]>([]);

  const handleClear = () => {
    setValues({ ...initialValues });
  };

  const handleFieldChange = (
    event: FieldChangeEvent,
    field: string,
    value: unknown,
  ) => {
    setValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleToggle = () => {
    setExpand((prevState) => !prevState);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      type: values.type,
      categoryId: values.categoryId,
      minAmount: values.amount?.[0],
      maxAmount: values.amount?.[1],
      startTime: values.startTime && format(values.startTime, 'yyyy-MM-dd'),
      endTime: values.endTime && format(values.endTime, 'yyyy-MM-dd'),
    };
    const filter = Object.entries(data).filter(([key, value]) => !!value);
    onFilter(Object.fromEntries(filter));
  };

  useEffect(() => {
    const fetchCategories = async (type: CategoryTypeRequest) => {
      const response = await categoryService.index({
        perPage: -1,
        type: type !== '' ? type : undefined,
      });
      setCategories([...response.data]);
    };

    fetchCategories(values.type);
  }, [values.type]);

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant="temporary"
    >
      <form
        className={clsx(classes.root, className)}
        onSubmit={handleSubmit}
      >
        <div className={classes.header}>
          <Button
            onClick={onClose}
            size="small"
          >
            <CloseIcon className={classes.buttonIcon} />
            关闭
          </Button>
        </div>
        <div className={classes.content}>
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              aria-expanded={expand}
              aria-hidden="true"
              onClick={handleToggle}
            >
              <Typography variant="h5">账单</Typography>
              {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expand}>
              <div className={classes.contentSectionContent}>
                <div className={classes.formGroup}>
                  <div className={classes.fieldGroup}>
                    <DatePicker
                      value={values.startTime}
                      className={classes.flexGrow}
                      name="startTime"
                      variant="inline"
                      inputVariant="outlined"
                      label="开始时间"
                      margin="dense"
                      format="PPP"
                      autoOk
                      onChange={(date) => {
                        handleFieldChange(null, 'startTime', date);
                      }}
                    />
                    <Divider className={classes.horizontalDivider} orientation="horizontal" flexItem />
                    <DatePicker
                      value={values.endTime}
                      className={classes.flexGrow}
                      name="endTime"
                      variant="inline"
                      inputVariant="outlined"
                      label="结束时间"
                      margin="dense"
                      format="PPP"
                      autoOk
                      onChange={(date) => {
                        handleFieldChange(null, 'endTime', date);
                      }}
                    />
                  </div>
                </div>
                <div className={classes.formGroup}>
                  <FormLabel>账单金额</FormLabel>
                  <div className={classes.fieldGroup}>
                    <Typography
                      className={classes.minAmount}
                      variant="body1"
                    >
                      {accounting.formatMoney(values.amount[0], '¥', 0)}
                    </Typography>
                    <Slider
                      className={classes.flexGrow}
                      max={6000}
                      min={0}
                      step={500}
                      onChange={(event, value) => handleFieldChange(event, 'amount', value)}
                      value={values.amount}
                      valueLabelDisplay="auto"
                    />
                    <Typography
                      className={classes.maxAmount}
                      variant="body1"
                    >
                      {accounting.formatMoney(values.amount[1], '¥', 0)}
                    </Typography>
                  </div>
                </div>
                <div className={classes.formGroup}>
                  <FormControl margin="dense">
                    <FormLabel>账单类型</FormLabel>
                    <RadioGroup
                      value={values.type}
                      aria-label="type"
                      name="type"
                      row
                      onChange={(event) => {
                        handleFieldChange(event, 'type', event.target.value);
                      }}
                    >
                      <FormControlLabel value="" control={<Radio />} label="全部" />
                      <FormControlLabel value="0" control={<Radio />} label="支出" />
                      <FormControlLabel value="1" control={<Radio />} label="收入" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className={classes.formGroup}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel htmlFor="categoryId">账单分类</InputLabel>
                    <Select
                      value={values.categoryId}
                      native
                      label="账单分类"
                      inputProps={{
                        name: 'categoryId',
                        id: 'categoryId',
                      }}
                      onChange={(event) => handleFieldChange(
                        event,
                        'categoryId',
                        event.target.value,
                      )}
                    >
                      <option aria-label="全部" value="" />
                      {
                        categories.map((category) => (
                          <option value={category.id} key={category.id}>{category.name}</option>
                        ))
                      }
                    </Select>
                  </FormControl>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
        <div className={classes.actions}>
          <Button
            fullWidth
            onClick={handleClear}
            variant="contained"
          >
            <DeleteIcon className={classes.buttonIcon} />
            清除
          </Button>
          <Button
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
          >
            搜索
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default Filter;
