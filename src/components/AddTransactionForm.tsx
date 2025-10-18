import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { months } from "@/utils/months";
import { showSuccess } from "@/utils/toast";

const categorias = [
  "Salário",
  "Alimentação",
  "Comunicações",
  "Transporte",
  "Transferência",
  "Lazer",
  "Educação",
  "Saúde",
  "Outros",
];

const carteiras = [
  "M-Pesa",
  "e-Mola",
  "Banco",
  "Dinheiro",
];

type AddTransactionFormProps = {
  onAdd: (tx: {
    descricao: string;
    valor: number;
    tipo: "receita" | "despesa";
    data: string;
    categoria: string;
    carteira: string;
  }) => void;
};

export const AddTransactionForm = ({ onAdd }: AddTransactionFormProps) => {
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [carteira, setCarteira] = useState(carteiras[0]);
  const [data, setData] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !categoria || !carteira || !data) return;
    onAdd({
      descricao,
      valor: Number(valor),
      tipo,
      data,
      categoria,
      carteira,
    });
    showSuccess("Transação adicionada!");
    setDescricao("");
    setValor("");
    setCategoria(categorias[0]);
    setCarteira(carteiras[0]);
    setTipo("despesa");
    setData(new Date().toISOString().slice(0, 10));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
      <div>
        <label className="block text-xs mb-1">Tipo</label>
        <Select value={tipo} onValueChange={v => setTipo(v as "receita" | "despesa")}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="receita">Receita</SelectItem>
            <SelectItem value="despesa">Despesa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-xs mb-1">Valor (MZN)</label>
        <Input
          type="number"
          min={0}
          value={valor}
          onChange={e => setValor(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Descrição</label>
        <Input
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Categoria</label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-xs mb-1">Carteira</label>
        <Select value={carteira} onValueChange={setCarteira}>
          <SelectTrigger>
            <SelectValue placeholder="Carteira" />
          </SelectTrigger>
          <SelectContent>
            {carteiras.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-xs mb-1">Data</label>
        <Input
          type="date"
          value={data}
          onChange={e => setData(e.target.value)}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" className="w-full">Adicionar</Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;