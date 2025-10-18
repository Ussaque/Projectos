import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";

type Transaction = {
  id: number;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  data: string;
  categoria: string;
};

const transacoes: Transaction[] = [
  {
    id: 1,
    descricao: "Salário (M-Pesa)",
    valor: 7000,
    tipo: "receita",
    data: "2024-06-01",
    categoria: "Salário",
  },
  {
    id: 2,
    descricao: "Compra no Mercado Central",
    valor: 1200,
    tipo: "despesa",
    data: "2024-06-03",
    categoria: "Alimentação",
  },
  {
    id: 3,
    descricao: "Recarga Movitel",
    valor: 200,
    tipo: "despesa",
    data: "2024-06-05",
    categoria: "Comunicações",
  },
  {
    id: 4,
    descricao: "Transferência recebida (e-Mola)",
    valor: 1000,
    tipo: "receita",
    data: "2024-06-07",
    categoria: "Transferência",
  },
  {
    id: 5,
    descricao: "Transporte (Chapa 100)",
    valor: 100,
    tipo: "despesa",
    data: "2024-06-08",
    categoria: "Transporte",
  },
];

export const TransactionList = () => (
  <Card>
    <CardHeader>
      <CardTitle>Transações Recentes</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="divide-y divide-gray-200">
        {transacoes.map((tx) => (
          <li key={tx.id} className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">{tx.descricao}</div>
              <div className="text-xs text-muted-foreground">{tx.data} • {tx.categoria}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${tx.tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
                {tx.tipo === "receita" ? "+" : "-"}{tx.valor.toLocaleString()} MZN
              </span>
              <Badge variant={tx.tipo === "receita" ? "outline" : "secondary"}>
                {tx.tipo === "receita" ? <ArrowDown className="w-4 h-4 mr-1" /> : <ArrowUp className="w-4 h-4 mr-1" />}
                {tx.tipo === "receita" ? "Receita" : "Despesa"}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default TransactionList;