import FinanceSummary from "@/components/FinanceSummary";
import FinanceChart from "@/components/FinanceChart";
import TransactionList from "@/components/TransactionList";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Dashboard Financeiro Pessoal</h1>
        <p className="text-center text-muted-foreground mb-8">
          Acompanhe suas finanças em Moçambique: receitas, despesas e transações recentes.
        </p>
        <FinanceSummary />
        <FinanceChart />
        <TransactionList />
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;