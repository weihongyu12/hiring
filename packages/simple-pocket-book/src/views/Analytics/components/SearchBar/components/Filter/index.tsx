import React, {
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
  FormLabel,
  Slider,
  Typography,
  Theme,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import accounting from 'accounting';
import { FilterHandler } from '../../types';

type FieldChangeEvent =
  ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?:string, value: unknown } | unknown>
  | MouseEvent<HTMLElement>
  | null;

export interface FilterValue {
  amount: number[];
}

type CloseHandler = () => void;

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
    amount: [1500, 4500],
  };

  const [expand, setExpand] = useState<boolean>(true);
  const [values, setValues] = useState<FilterValue>({ ...initialValues });

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
      minAmount: values.amount?.[0],
      maxAmount: values.amount?.[1],
    };
    const filter = Object.entries(data).filter(([key, value]) => !!value);
    onFilter(Object.fromEntries(filter));
  };

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
