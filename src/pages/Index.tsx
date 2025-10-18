import { useState, useMemo, useEffect } from "react";
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Funções utilitárias para mês/ano
const getMonth = (dateStr: string) => Number(dateStr.split("-")[1]);
const getYear = (dateStr: string) => Number(dateStr.split("-")[0]);

const Index = () => {
  const now = new Date();
  const [period, setPeriod] = useState<Period>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de edição
  const [editTx, setEditTx] = useState<null | any>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Carrega transações do backend
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/transacoes`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Erro ao carregar transações do servidor.");
        setLoading(false);
      });
  }, []);

  // Adiciona nova transação
  const handleAdd = (tx: Omit<any, "id">) => {
    fetch(`${API_URL}/transacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setTransactions(prev => [
            { ...tx, id: data.id },
            ...prev,
          ]);
          toast.success("Transação adicionada!");
        } else {
          toast.error("Erro ao adicionar transação.");
        }
      })
      .catch(() => toast.error("Erro ao adicionar transação."));
  };

  // Edita transação existente
  const handleEdit = (tx: any) => {
    setEditTx(tx);
    setEditOpen(true);
  };

  const handleSaveEdit = (tx: any) => {
    fetch(`${API_URL}/transacoes/${tx.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactions(prev =>
            prev.map(item => (item.id === tx.id ? tx : item))
          );
          toast.success("Transação atualizada!");
        } else {
          toast.error("Erro ao atualizar transação.");
        }
      })
      .catch(() => toast.error("Erro ao atualizar transação."));
  };

  // Remove transação
  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja apagar esta transação?")) {
      fetch(`${API_URL}/transacoes/${id}`, {
        method: "DELETE",
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTransactions(prev => prev.filter(tx => tx.id !== id));
            toast.success("Transação removida!");
          } else {
            toast.error("Erro ao remover transação.");
          }
        })
        .catch(() => toast.error("Erro ao remover transação."));
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
      .reduce((acc, tx) => acc + Number(tx.valor), 0);
    const despesas = filteredTransactions
      .filter((tx) => tx.tipo === "despesa")
      .reduce((acc, tx) => acc + Number(tx.valor), 0);
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
        catMap[tx.categoria] = (catMap[tx.categoria] || 0) + Number(tx.valor);
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
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando transações...</div>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
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