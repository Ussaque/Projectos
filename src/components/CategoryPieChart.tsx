import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type PieData = {
  name: string;
  value: number;
};

const COLORS = [
  "#22c55e", "#3b82f6", "#ef4444", "#f59e42", "#a855f7", "#eab308", "#0ea5e9"
];

type CategoryPieChartProps = {
  data: PieData[];
};

export const CategoryPieChart = ({ data }: CategoryPieChartProps) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Despesas por Categoria</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default CategoryPieChart;