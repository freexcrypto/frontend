"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import useGetRecentPayment from "@/hooks/getRecentPayment";
import moment from "moment";

export default function ChartBalance() {
  const { business } = useGetBusinessByUser();
  const { paymentLinks, loading } = useGetRecentPayment(business?.id);

  // Group payments by month and sum the amounts for the last 6 months
  const now = moment();
  const months = Array.from({ length: 6 }, (_, i) =>
    now.clone().subtract(5 - i, "months")
  );
  const chartData = months.map((month) => {
    const monthStr = month.format("MMMM");
    const total = paymentLinks
      ? paymentLinks
          .filter(
            (p) =>
              moment(p.updated_at).isSame(month, "month") && p.status === "paid"
          )
          .reduce((sum, p) => sum + Number(p.amount), 0)
      : 0;
    return { month: monthStr, paid: total };
  });

  const chartConfig = {
    paid: {
      label: "Paid Amount",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-1/2 max-w-full">
      <CardHeader>
        <CardTitle>Payments Area Chart</CardTitle>
        <CardDescription>
          Showing total paid amount for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-0 px-2">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            Loading...
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full h-[200px] max-h-full min-h-0"
          >
            <AreaChart
              width={undefined}
              height={200}
              data={chartData}
              margin={{
                top: 10,
                left: 12,
                right: 12,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                style={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                style={{ fontSize: 12 }}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="paid"
                type="monotone"
                fill="url(#colorPaid)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fillOpacity={1}
              />
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {/* You can update this to show a real trend if desired */}
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {months[0].format("MMMM")} - {months[5].format("MMMM YYYY")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
