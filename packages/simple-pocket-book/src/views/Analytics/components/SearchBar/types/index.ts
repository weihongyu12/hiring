import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

export type SearchHandler = (date: MaterialUiPickersDate) => void;
export type FilterHandler = (filter: Record<string, unknown>) => void;
