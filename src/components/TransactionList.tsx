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
  carteira?: string;
};

type TransactionListProps = {
  transactions: Transaction[];
};

export const TransactionList = ({ transactions }: TransactionListProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Transações Recentes</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="divide-y divide-gray-200">
        {transactions.length === 0 && (
          <li className="py-4 text-center text-muted-foreground">Nenhuma transação neste período.</li>
        )}
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">{tx.descricao}</div>
              <div className="text-xs text-muted-foreground">
                {tx.data} • {tx.categoria}
                {tx.carteira ? ` • ${tx.carteira}` : ""}
              </div>
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