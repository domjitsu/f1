import React from "react";
import { BarChart } from "@tremor/react";

interface LapData {
  code: string;
  "Lap Time": number;
}

interface BarChartProps {
  data: LapData[];
}

export const TremorChart: React.FC<BarChartProps> = ({ data }) => {
  const lapTimes = data.map((item) => item["Lap Time"]);
  const maxValue = Math.max(...lapTimes) + 3;
  const minValue = Math.min(...lapTimes) - 3;

  return (
    <BarChart
      className="mt-6"
      data={data}
      index="code"
      categories={["Lap Time"]}
      colors={["blue"]}
      allowDecimals={true}
      minValue={minValue}
      maxValue={maxValue}
      showAnimation={true}
    />
  );
};
