import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddTransactionForm from "./AddTransactionForm";

type Transaction = {
  id: number;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  data: string;
  categoria: string;
  carteira: string;
};

type EditTransactionModalProps = {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
};

export const EditTransactionModal = ({
  transaction,
  open,
  onClose,
  onSave,
}: EditTransactionModalProps) => {
  const [form, setForm] = useState<Omit<Transaction, "id"> | null>(null);

  useEffect(() => {
    if (transaction) {
      const { id, ...rest } = transaction;
      setForm(rest);
    }
  }, [transaction]);

  if (!transaction || !form) return null;

  const handleSubmit = (tx: Omit<Transaction, "id">) => {
    onSave({ ...tx, id: transaction.id });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        <AddTransactionForm
          initialValues={form}
          onAdd={handleSubmit}
          submitLabel="Salvar"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;