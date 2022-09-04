import { ProxyType } from "immer/dist/internal";
import React from "react";
import "./chart.scss";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";
import "./chart.scss";

export interface IChartValues {
  timestamp: string;
  data: number;
}

export interface IChartProps {
  data: Array<IChartValues>;
  name: string;
  color: string;
}

const ChartComponent = (props: IChartProps) => {
  return (
    <>
      <h1 style={{ color: `${props.color}` }}>{props.name}</h1>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart style={{ cursor: `pointer` }} data={props.data}>
          <XAxis dataKey="timestamp" />
          <Line stroke={props.color} dataKey="data" activeDot={{ r: 10 }} />
          <CartesianGrid stroke="#ccc" />
          <YAxis />

          <Tooltip
            wrapperStyle={{ color: `green` }}
            contentStyle={{ color: `red` }}
            itemStyle={{ fontFamily: `Roboto` }}
            labelStyle={{ fontFamily: `Roboto` }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartComponent;
