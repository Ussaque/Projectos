import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onEdit?: (tx: Transaction) => void;
  onDelete?: (id: number) => void;
};

export const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => (
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
          <li key={tx.id} className="flex items-center justify-between py-3 gap-2">
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
              {onEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-blue-600"
                  onClick={() => onEdit(tx)}
                  aria-label="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => onDelete(tx.id)}
                  aria-label="Apagar"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default TransactionList;