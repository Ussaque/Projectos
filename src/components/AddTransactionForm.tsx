import { useState, useEffect } from "react";
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
  initialValues?: {
    descricao: string;
    valor: number;
    tipo: "receita" | "despesa";
    data: string;
    categoria: string;
    carteira: string;
  };
  submitLabel?: string;
};

export const AddTransactionForm = ({
  onAdd,
  initialValues,
  submitLabel = "Adicionar",
}: AddTransactionFormProps) => {
  const [tipo, setTipo] = useState<"receita" | "despesa">(initialValues?.tipo || "despesa");
  const [descricao, setDescricao] = useState(initialValues?.descricao || "");
  const [valor, setValor] = useState(initialValues?.valor?.toString() || "");
  const [categoria, setCategoria] = useState(initialValues?.categoria || categorias[0]);
  const [carteira, setCarteira] = useState(initialValues?.carteira || "");
  const [data, setData] = useState(initialValues?.data || (() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  })());

  useEffect(() => {
    if (initialValues) {
      setTipo(initialValues.tipo);
      setDescricao(initialValues.descricao);
      setValor(initialValues.valor.toString());
      setCategoria(initialValues.categoria);
      setCarteira(initialValues.carteira);
      setData(initialValues.data);
    }
  }, [initialValues]);

  // Limpa carteira se mudar para receita
  useEffect(() => {
    if (tipo === "receita") {
      setCarteira("");
    } else if (tipo === "despesa" && !carteira) {
      setCarteira(carteiras[0]);
    }
    // eslint-disable-next-line
  }, [tipo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !categoria || !data) return;
    if (tipo === "despesa" && !carteira) return;
    onAdd({
      descricao,
      valor: Number(valor),
      tipo,
      data,
      categoria,
      carteira: tipo === "despesa" ? carteira : "",
    });
    showSuccess(submitLabel === "Adicionar" ? "Transação adicionada!" : "Transação atualizada!");
    if (!initialValues) {
      setDescricao("");
      setValor("");
      setCategoria(categorias[0]);
      setCarteira("");
      setTipo("despesa");
      setData(new Date().toISOString().slice(0, 10));
    }
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
        <label className="block text-xs mb-1">Carteira {tipo === "despesa" && <span className="text-red-500">*</span>}</label>
        <Select
          value={carteira}
          onValueChange={setCarteira}
          disabled={tipo === "receita"}
          required={tipo === "despesa"}
        >
          <SelectTrigger>
            <SelectValue placeholder={tipo === "despesa" ? "Carteira" : "Não necessário"} />
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
        <Button type="submit" className="w-full">{submitLabel}</Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;