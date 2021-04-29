import Paper from '@material-ui/core/Paper';
import {
    ArgumentAxis,
    Chart,
    Legend,
    PieSeries,
    Title,
    Tooltip,
    ValueAxis
} from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, BarSeries, EventTracker } from '@devexpress/dx-react-chart';
import { scaleBand } from '@devexpress/dx-chart-core';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Label } from '../Repositories/Label';
import { LanguagePercents, commitedDateState } from '../../types/appTypes';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '50%',
            [theme.breakpoints.down('md')]: {
                width: '100%'
            }
        },
        graphs: {
            display: 'flex',
            [theme.breakpoints.down('md')]: {
                display: 'block'
            }
        },
        graph: {
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '48%',
            [theme.breakpoints.down('md')]: {
                width: '100%',
                marginTop: '10px'
            }
        }
    })
);

const LabelValueAxis = Label(' раз');

interface PropsType {
    languagesInPercents: LanguagePercents[];
    commitStats: commitedDateState[];
}

export const UserInfoGraphs = (props: PropsType) => {
    const classes = useStyles();

    const getCommitsOfLastYear = () => props.commitStats.slice(-12);

    return (
        <div className={classes.graphs}>
            <Paper className={classes.graph}>
                <Chart data={props.languagesInPercents}>
                    <ArgumentScale factory={scaleBand} />
                    <PieSeries valueField="percent" argumentField="name" outerRadius={1} />
                    <Legend />
                    <Title text="Статистика использования языков" />
                    <EventTracker />
                    <Tooltip />
                </Chart>
            </Paper>
            <Paper className={classes.graph}>
                <Chart data={getCommitsOfLastYear()}>
                    <ArgumentScale factory={scaleBand} />
                    <ArgumentAxis />
                    <ValueAxis labelComponent={LabelValueAxis} />
                    <BarSeries valueField="number" argumentField="month" />
                    <Title text="Частота коммитов по месяцам" />
                    <EventTracker />
                    <Tooltip />
                </Chart>
            </Paper>
        </div>
    );
};
