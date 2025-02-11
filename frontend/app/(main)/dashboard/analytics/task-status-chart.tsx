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
  todo: {
    label: "To Do",
    color: "hsl(var(--chart-1))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  inReview: {
    label: "In Review",
    color: "hsl(var(--chart-3))",
  },
  done: {
    label: "Done",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function TaskStatusChart({ data }: { data: ChartType }) {
  const chartData = [
    {
      status: "todo",
      value: data.taskByStatus.todo,
      fill: "var(--color-todo)",
    },
    {
      status: "inProgress",
      value: data.taskByStatus.in_progress,
      fill: "var(--color-inProgress)",
    },
    {
      status: "inReview",
      value: data.taskByStatus.in_review,
      fill: "var(--color-inReview)",
    },
    {
      status: "done",
      value: data.taskByStatus.done,
      fill: "var(--color-done)",
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
        <Pie data={chartData} dataKey="value" nameKey="status" />
        <ChartLegend
          content={<ChartLegendContent nameKey="status" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center whitespace-nowrap"
        />
      </PieChart>
    </ChartContainer>
  );
}
