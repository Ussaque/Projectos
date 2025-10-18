import { useState, useMemo } from "react";
import FinanceSummary from "@/components/FinanceSummary";
import FinanceChart from "@/components/FinanceChart";
import TransactionList from "@/components/TransactionList";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { PeriodFilter, Period } from "@/components/PeriodFilter";
import CategoryPieChart from "@/components/CategoryPieChart";
import AddTransactionForm from "@/components/AddTransactionForm";
import EditTransactionModal from "@/components/EditTransactionModal";
import { months } from "@/utils/months";
import { toast } from "sonner";

// Dados de exemplo (normalmente viriam de um backend)
const initialTransactions = [
  {
    id: 1,
    descricao: "Salário (M-Pesa)",
    valor: 7000,
    tipo: "receita",
    data: "2024-06-01",
    categoria: "Salário",
    carteira: "M-Pesa",
  },
  {
    id: 2,
    descricao: "Compra no Mercado Central",
    valor: 1200,
    tipo: "despesa",
    data: "2024-06-03",
    categoria: "Alimentação",
    carteira: "M-Pesa",
  },
  {
    id: 3,
    descricao: "Recarga Movitel",
    valor: 200,
    tipo: "despesa",
    data: "2024-06-05",
    categoria: "Comunicações",
    carteira: "M-Pesa",
  },
  {
    id: 4,
    descricao: "Transferência recebida (e-Mola)",
    valor: 1000,
    tipo: "receita",
    data: "2024-06-07",
    categoria: "Transferência",
    carteira: "e-Mola",
  },
  {
    id: 5,
    descricao: "Transporte (Chapa 100)",
    valor: 100,
    tipo: "despesa",
    data: "2024-06-08",
    categoria: "Transporte",
    carteira: "M-Pesa",
  },
  {
    id: 6,
    descricao: "Supermercado Shoprite",
    valor: 800,
    tipo: "despesa",
    data: "2024-05-15",
    categoria: "Alimentação",
    carteira: "Banco",
  },
  {
    id: 7,
    descricao: "Internet Vodacom",
    valor: 500,
    tipo: "despesa",
    data: "2024-06-10",
    categoria: "Comunicações",
    carteira: "Banco",
  },
];

const getMonth = (dateStr: string) => Number(dateStr.split("-")[1]);
const getYear = (dateStr: string) => Number(dateStr.split("-")[0]);

const Index = () => {
  const now = new Date();
  const [period, setPeriod] = useState<Period>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  const [transactions, setTransactions] = useState(initialTransactions);

  // Modal de edição
  const [editTx, setEditTx] = useState<null | typeof initialTransactions[0]>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Adiciona nova transação
  const handleAdd = (tx: Omit<typeof initialTransactions[0], "id">) => {
    setTransactions((prev) => [
      { ...tx, id: prev.length ? Math.max(...prev.map(t => t.id)) + 1 : 1 },
      ...prev,
    ]);
  };

  // Edita transação existente
  const handleEdit = (tx: typeof initialTransactions[0]) => {
    setEditTx(tx);
    setEditOpen(true);
  };

  const handleSaveEdit = (tx: typeof initialTransactions[0]) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === tx.id ? tx : item))
    );
    toast.success("Transação atualizada!");
  };

  // Remove transação
  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja apagar esta transação?")) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      toast.success("Transação removida!");
    }
  };

  // Filtra transações pelo período selecionado
  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (tx) =>
          getMonth(tx.data) === period.month && getYear(tx.data) === period.year
      ),
    [period, transactions]
  );

  // Calcula resumo financeiro
  const summary = useMemo(() => {
    const receitas = filteredTransactions
      .filter((tx) => tx.tipo === "receita")
      .reduce((acc, tx) => acc + tx.valor, 0);
    const despesas = filteredTransactions
      .filter((tx) => tx.tipo === "despesa")
      .reduce((acc, tx) => acc + tx.valor, 0);
    return {
      saldo: receitas - despesas,
      receitas,
      despesas,
      moeda: "MZN",
    };
  }, [filteredTransactions]);

  // Dados para gráfico de pizza (despesas por categoria)
  const pieData = useMemo(() => {
    const catMap: Record<string, number> = {};
    filteredTransactions
      .filter((tx) => tx.tipo === "despesa")
      .forEach((tx) => {
        catMap[tx.categoria] = (catMap[tx.categoria] || 0) + tx.valor;
      });
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Dashboard Financeiro Pessoal</h1>
        <p className="text-center text-muted-foreground mb-8">
          Acompanhe suas finanças em Moçambique: receitas, despesas e transações recentes.
        </p>
        <PeriodFilter period={period} onChange={setPeriod} />
        <AddTransactionForm onAdd={handleAdd} />
        <FinanceSummary {...summary} />
        <CategoryPieChart data={pieData} />
        <FinanceChart transactions={transactions} year={period.year} />
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <EditTransactionModal
          transaction={editTx}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveEdit}
        />
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;