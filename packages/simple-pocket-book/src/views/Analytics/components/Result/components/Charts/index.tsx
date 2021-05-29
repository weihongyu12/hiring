import React, {
  useEffect,
  useState,
  FC,
} from 'react';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ApexCharts from 'apexcharts';
import ReactApexCharts from 'react-apexcharts';
import { fontFamily, palette } from 'theme';

export interface ChartsProps {
  className?: string;
  income?: number;
  expenditure?: number;
}

const useStyles = makeStyles(() => createStyles({
  root: {},
}));

const options = {
  chart: {
    id: 'charts',
    fontFamily: fontFamily.join(','),
  },
  colors: [palette.primary.main, palette.secondary.main],
  labels: ['收入', '支出'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: '100%',
      },
      legend: {
        position: 'bottom',
      },
    },
  }],
  noData: {
    text: '本月份没有账单',
  },
};

const Charts: FC<ChartsProps> = ({
  className = '',
  income = 0,
  expenditure = 0,
}) => {
  const classes = useStyles();

  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    if (income === 0 && expenditure === 0) {
      setSeries([]);
      ApexCharts.exec('charts', 'updateSeries', [], true);
    } else {
      setSeries([income, expenditure]);
      ApexCharts.exec('charts', 'updateSeries', [income, expenditure], true);
    }
  }, [income, expenditure]);

  return (
    <Card className={clsx(classes.root, className)}>
      <CardHeader title="统计" />
      <CardContent>
        <ReactApexCharts options={options} series={[...series]} type="donut" />
      </CardContent>
    </Card>
  );
};

export default Charts;
