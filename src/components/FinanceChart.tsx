import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { months } from "@/utils/months";

type Transaction = {
  id: number;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  data: string;
  categoria: string;
  carteira?: string;
};

type FinanceChartProps = {
  transactions: Transaction[];
  year: number;
};

export const FinanceChart = ({ transactions, year }: FinanceChartProps) => {
  // Monta os dados mês a mês para o ano selecionado
  const data = months.map((month, idx) => {
    const receitas = transactions
      .filter(
        (tx) =>
          tx.tipo === "receita" &&
          new Date(tx.data).getFullYear() === year &&
          new Date(tx.data).getMonth() === idx
      )
      .reduce((acc, tx) => acc + tx.valor, 0);
    const despesas = transactions
      .filter(
        (tx) =>
          tx.tipo === "despesa" &&
          new Date(tx.data).getFullYear() === year &&
          new Date(tx.data).getMonth() === idx
      )
      .reduce((acc, tx) => acc + tx.valor, 0);
    return {
      name: month.slice(0, 3),
      Receitas: receitas,
      Despesas: despesas,
    };
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Receitas vs Despesas ({year})</CardTitle>
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
};

export default FinanceChart;