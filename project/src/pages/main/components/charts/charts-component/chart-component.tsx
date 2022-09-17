import React from "react";
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

export interface IChartValues {
  timestamp: string;
  data: number;
}

export interface IChartProps {
  data: Array<IChartValues>;
  color: string;
  name: string;
}

const ChartComponent = (props: IChartProps) => {
  return (
    <>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart style={{ cursor: `pointer` }} data={props.data}>
          <XAxis dataKey="timestamp" />
          <Line
            name={props.name}
            stroke={props.color}
            dataKey="data"
            activeDot={{ r: 10 }}
            strokeWidth={4}
          />
          <CartesianGrid stroke="#ccc" />
          <YAxis />

          <Tooltip
            wrapperStyle={{ color: `green` }}
            contentStyle={{ color: `red` }}
            itemStyle={{ fontFamily: `Roboto` }}
            labelStyle={{ color: `${props.color}` }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartComponent;
