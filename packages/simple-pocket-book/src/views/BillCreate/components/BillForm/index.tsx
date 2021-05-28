import React, {
  useEffect,
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from 'react';
import { useHistory } from 'react-router';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import validate from 'validate.js';
import { useSnackbar } from 'notistack';
import { CurrencyFormatInput } from 'components';
import { Category } from 'types';
import { billService, categoryService } from 'service';

type CategoryType = '0' | '1';

type FieldChangeEvent =
  ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?:string, value: unknown } | unknown>
  | MouseEvent<HTMLElement>
  | null;

interface FormValue {
  amount: string;
  type: CategoryType;
  categoryId: string;
}

interface FormState {
  isValid: boolean;
  values: FormValue;
  errors: Record<string, any[]>;
  touched: Record<string, boolean>;
}

export interface BillFormProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {},
  formGroup: {
    padding: theme.spacing(2, 0),
    [theme.breakpoints.up('md')]: {
      maxWidth: `${(1 / 3) * 100}%`,
    },
  },
  actions: {
    justifyContent: 'flex-end',
  },
}));

const schema = {
  amount: {
    presence: { allowEmpty: false, message: '请输入账单金额' },
    numericality: { strict: true, message: '请输入合法的数值' },
  },
  type: {
    presence: { allowEmpty: false, message: '请输入账单类型' },
    inclusion: {
      within: {
        0: '支出',
        1: '收入',
      },
      message: '账单类型值不合法%{value}',
    },
  },
  categoryId: {
    presence: { allowEmpty: false, message: '请输入账单分类' },
  },
};

const BillForm: FC<BillFormProps> = ({
  className = '',
}) => {
  const classes = useStyles();

  const [formState, setFormState] = useState<FormState>({
    isValid: false,
    values: {
      amount: '',
      type: '0',
      categoryId: '',
    },
    errors: {},
    touched: {},
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const hasError = (field: string) => (!!(formState.touched[field] && formState.errors[field]));

  const handleFieldChange = (
    event: FieldChangeEvent,
    field: string,
    value: unknown,
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      values: {
        ...prevState.values,
        [field]: value,
      },
      touched: {
        ...prevState.touched,
        [field]: true,
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await billService.create({ ...formState.values });
      enqueueSnackbar('账单创建成功', {
        variant: 'success',
      });
      history.push('/bill');
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    const errors = validate(formState.values, schema, { fullMessages: false });

    setFormState((prevState) => ({
      ...prevState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values]);

  useEffect(() => {
    const fetchCategories = async (type: CategoryType) => {
      const response = await categoryService.index({
        perPage: -1,
        type,
      });
      setCategories([...response.data]);
    };

    fetchCategories(formState.values.type);
  }, [formState.values.type]);

  return (
    <form onSubmit={handleSubmit}>
      <Card className={clsx(classes.root, className)}>
        <CardContent>
          <div className={classes.formGroup}>
            <TextField
              value={formState.values.amount}
              error={hasError('amount')}
              helperText={hasError('amount') ? [formState.errors.amount] : ''}
              name="amount"
              label="账单金额"
              variant="outlined"
              required
              fullWidth
              inputMode="numeric"
              InputProps={{
                inputComponent: CurrencyFormatInput as any,
                inputProps: {
                  prefix: '¥',
                  decimalScale: 2,
                },
              }}
              onChange={(event) => handleFieldChange(
                event,
                'amount',
                event.target.value,
              )}
            />
          </div>
          <div className={classes.formGroup}>
            <FormControl
              required
              fullWidth
              error={hasError('amount')}
            >
              <FormLabel>账单类型</FormLabel>
              <RadioGroup
                value={formState.values.type}
                aria-label="type"
                name="type"
                row
                onChange={(event) => {
                  handleFieldChange(event, 'type', event.target.value);
                }}
              >
                <FormControlLabel value="0" control={<Radio />} label="支出" />
                <FormControlLabel value="1" control={<Radio />} label="收入" />
              </RadioGroup>
              {
                hasError('type') && (
                  <FormHelperText>{[formState.errors.type]}</FormHelperText>
                )
              }
            </FormControl>
          </div>
          <div className={classes.formGroup}>
            <FormControl
              variant="outlined"
              required
              fullWidth
              error={hasError('categoryId')}
            >
              <InputLabel shrink htmlFor="categoryId">账单分类</InputLabel>
              <Select
                value={formState.values.categoryId}
                native
                label="账单分类"
                placeholder="请选择账单分类"
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
                <option aria-label="请选择账单分类" value="" disabled>请选择账单分类</option>
                {
                  categories.map((category) => (
                    <option value={category.id} key={category.id}>{category.name}</option>
                  ))
                }
              </Select>
              {
                hasError('categoryId') && (
                  <FormHelperText>{[formState.errors.categoryId]}</FormHelperText>
                )
              }
            </FormControl>
          </div>
        </CardContent>
        <Divider />
        <CardActions className={classes.actions}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
          >
            创建账单
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default BillForm;
