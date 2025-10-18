import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const financeData = {
  saldo: 12500,
  receitas: 8000,
  despesas: 5500,
  moeda: "MZN",
};

export const FinanceSummary = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Saldo</CardTitle>
        <Banknote className="text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {financeData.saldo.toLocaleString()} {financeData.moeda}
        </div>
        <p className="text-xs text-muted-foreground">Total disponível</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Receitas</CardTitle>
        <ArrowDownCircle className="text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {financeData.receitas.toLocaleString()} {financeData.moeda}
        </div>
        <p className="text-xs text-muted-foreground">Este mês</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Despesas</CardTitle>
        <ArrowUpCircle className="text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {financeData.despesas.toLocaleString()} {financeData.moeda}
        </div>
        <p className="text-xs text-muted-foreground">Este mês</p>
      </CardContent>
    </Card>
  </div>
);

export default FinanceSummary;