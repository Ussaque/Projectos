import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", Receitas: 7000, Despesas: 4000 },
  { name: "Fev", Receitas: 8000, Despesas: 5000 },
  { name: "Mar", Receitas: 9000, Despesas: 6000 },
  { name: "Abr", Receitas: 8500, Despesas: 5500 },
  { name: "Mai", Receitas: 8000, Despesas: 5800 },
];

export const FinanceChart = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Receitas vs Despesas (MZN)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default FinanceChart;