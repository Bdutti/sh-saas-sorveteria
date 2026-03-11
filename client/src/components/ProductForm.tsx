import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  onSuccess?: () => void;
}

export function ProductForm({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    price: product?.price ? (product.price / 100).toFixed(2) : "",
    costPrice: product?.costPrice ? (product.costPrice / 100).toFixed(2) : "",
    stock: product?.stock || "",
    minStock: product?.minStock || "",
    categoryId: product?.categoryId || null,
    active: product?.active !== false,
  });

  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nome do produto é obrigatório");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: Math.round(parseFloat(formData.price || "0") * 100),
        costPrice: Math.round(parseFloat(formData.costPrice || "0") * 100),
        stock: parseInt(formData.stock || "0"),
        minStock: parseInt(formData.minStock || "0"),
        categoryId: formData.categoryId,
        active: formData.active,
      };

      if (product?.id) {
        await updateMutation.mutateAsync({ id: product.id, ...payload });
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Produto criado com sucesso!");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar produto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {product?.id ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {product?.id
              ? "Atualize as informações do produto"
              : "Preencha os dados para criar um novo produto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Sorvete Chocolate"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Ex: SKU001"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">Preço de Venda (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="minStock">Estoque Mínimo</Label>
              <Input
                id="minStock"
                name="minStock"
                type="number"
                value={formData.minStock}
                onChange={handleChange}
                placeholder="0"
                className="mt-1"
              />
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <input
                id="active"
                name="active"
                type="checkbox"
                checked={formData.active}
                onChange={handleChange}
                className="rounded border-border"
              />
              <Label htmlFor="active" className="mb-0 cursor-pointer">
                Produto Ativo
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Salvando..."
                : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
