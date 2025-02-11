"use client";

import { Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartType } from "@/types/project";

const chartConfig = {
  low: {
    label: "Low",
    color: "hsl(var(--chart-1))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-2))",
  },
  high: {
    label: "High",
    color: "hsl(var(--chart-3))",
  },
  urgent: {
    label: "Urgent",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function TaskPriorityChart({ data }: { data: ChartType }) {
  const chartData = [
    {
      priority: "low",
      value: data.taskByPriority.low,
      fill: "var(--color-low)",
    },
    {
      priority: "medium",
      value: data.taskByPriority.medium,
      fill: "var(--color-medium)",
    },
    {
      priority: "high",
      value: data.taskByPriority.high,
      fill: "var(--color-high)",
    },
    {
      priority: "urgent",
      value: data.taskByPriority.urgent,
      fill: "var(--color-urgent)",
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="visitors" hideLabel />}
        />
        <Pie data={chartData} dataKey="value" nameKey="priority" />
        <ChartLegend
          content={<ChartLegendContent nameKey="priority" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center whitespace-nowrap"
        />
      </PieChart>
    </ChartContainer>
  );
}
